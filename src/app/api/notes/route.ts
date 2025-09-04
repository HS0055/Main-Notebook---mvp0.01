import { NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, subjects } from '@/db/schema';
import { eq, and, like, desc } from 'drizzle-orm';
import { z } from 'zod';

// Zod schema for note validation
const CreateNoteSchema = z.object({
  title: z.string()
    .min(1, "Title must be between 1 and 120 characters")
    .max(120, "Title must be between 1 and 120 characters")
    .transform(val => val.trim()),
  content: z.string()
    .min(1, "Content must be between 1 and 20000 characters")
    .max(20000, "Content must be between 1 and 20000 characters"),
  subjectId: z.string()
    .uuid("SubjectId must be a valid UUID format")
});

// Store for idempotency keys (in production, use Redis or database)
const idempotencyStore = new Map<string, any>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    const baseSelect = db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        subjectId: notes.subjectId,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        subject: {
          id: subjects.id,
          name: subjects.name,
          uuid: subjects.uuid,
        },
      })
      .from(notes)
      .innerJoin(subjects, eq(notes.subjectId, subjects.uuid));

    const results = search
      ? await baseSelect
          .where(like(notes.title, `%${search}%`))
          .orderBy(desc(notes.createdAt))
          .limit(limit)
          .offset(offset)
      : await baseSelect
          .orderBy(desc(notes.createdAt))
          .limit(limit)
          .offset(offset);

    return NextResponse.json({
      ok: true,
      data: results,
      error: null
    }, { status: 200 });

  } catch (error) {
    console.error('GET notes error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check Content-Type header
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'Content-Type must be application/json'
      }, { status: 400 });
    }

    // Check for idempotency key
    const idempotencyKey = request.headers.get('idempotency-key');
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      const cachedResponse = idempotencyStore.get(idempotencyKey);
      return NextResponse.json(cachedResponse.body, { status: cachedResponse.status });
    }

    // Parse JSON body
    let body;
    try {
      const text = await request.text();
      if (!text || text.trim() === '') {
        return NextResponse.json({
          ok: false,
          data: null,
          error: 'Request body cannot be empty'
        }, { status: 400 });
      }
      body = JSON.parse(text);
    } catch (error) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'Invalid JSON format'
      }, { status: 400 });
    }

    // Check if body is empty object
    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'Request body cannot be empty'
      }, { status: 400 });
    }

    // Check for required fields first (before Zod validation)
    if (body.title === undefined || body.title === null) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'Title is required'
      }, { status: 422 });
    }

    if (body.content === undefined || body.content === null) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'Content is required'
      }, { status: 422 });
    }

    if (body.subjectId === undefined || body.subjectId === null) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'SubjectId is required'
      }, { status: 422 });
    }

    // Check data types
    if (typeof body.title !== 'string') {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'Title must be a string'
      }, { status: 422 });
    }

    if (typeof body.content !== 'string') {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'Content must be a string'
      }, { status: 422 });
    }

    if (typeof body.subjectId !== 'string') {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'SubjectId must be a string'
      }, { status: 422 });
    }

    // Validate using Zod schema
    const validation = CreateNoteSchema.safeParse(body);
    if (!validation.success) {
      const firstIssue = validation.error.issues?.[0];
      return NextResponse.json({
        ok: false,
        data: null,
        error: firstIssue?.message || 'Validation failed'
      }, { status: 422 });
    }

    const { title, content, subjectId } = validation.data;

    // SQL Injection Protection: Using Drizzle ORM with parameterized queries
    // Check if subject exists
    const existingSubject = await db.select()
      .from(subjects)
      .where(eq(subjects.uuid, subjectId))
      .limit(1);

    if (existingSubject.length === 0) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: 'Subject not found'
      }, { status: 422 });
    }

    // Check for duplicate title + subjectId combination
    const existingNote = await db.select()
      .from(notes)
      .where(and(
        eq(notes.title, title),
        eq(notes.subjectId, subjectId)
      ))
      .limit(1);

    if (existingNote.length > 0) {
      const response = {
        ok: false,
        data: null,
        error: 'A note with this title already exists for this subject'
      };
      
      // Cache idempotency response
      if (idempotencyKey) {
        idempotencyStore.set(idempotencyKey, { body: response, status: 409 });
      }
      
      return NextResponse.json(response, { status: 409 });
    }

    // Create new note - Special characters are safely handled by Drizzle ORM
    const timestamp = new Date().toISOString();
    const newNote = await db.insert(notes)
      .values({
        title,
        content,
        subjectId,
        createdAt: timestamp,
        updatedAt: timestamp
      })
      .returning();

    const response = {
      ok: true,
      data: newNote[0],
      error: null
    };

    // Cache idempotency response
    if (idempotencyKey) {
      idempotencyStore.set(idempotencyKey, { body: response, status: 201 });
    }

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('POST notes error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: 'Internal server error'
    }, { status: 500 });
  }
}