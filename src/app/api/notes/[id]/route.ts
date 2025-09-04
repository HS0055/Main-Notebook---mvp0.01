import { NextResponse } from 'next/server';
import { db } from '@/db';
import { notes, subjects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: any) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: "Valid ID is required"
      }, { status: 400 });
    }

    const noteId = parseInt(id);

    // Query note with subject information
    const result = await db
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
          createdAt: subjects.createdAt,
          updatedAt: subjects.updatedAt
        }
      })
      .from(notes)
      .innerJoin(subjects, eq(notes.subjectId, subjects.uuid))
      .where(eq(notes.id, noteId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({
        ok: false,
        data: null,
        error: "Note not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      data: result[0],
      error: null
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/notes/[id] error:', error);
    return NextResponse.json({
      ok: false,
      data: null,
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}