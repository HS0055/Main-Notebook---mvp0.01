import { NextResponse } from 'next/server';
import { db } from '@/db';
import { notebooks, pages } from '@/db/schema';
import { eq, like, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Single record fetch
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select({
        id: notebooks.id,
        title: notebooks.title,
        cover: notebooks.cover,
        studyMode: notebooks.studyMode,
        createdAt: notebooks.createdAt,
        updatedAt: notebooks.updatedAt
      })
        .from(notebooks)
        .where(eq(notebooks.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Notebook not found' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0]);
    } else {
      // List with pagination and search
      const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
      const offset = parseInt(searchParams.get('offset') || '0');
      const search = searchParams.get('search');
      const sort = searchParams.get('sort') || 'createdAt';
      const order = searchParams.get('order') || 'desc';

      const orderColumn = (() => {
        switch (sort) {
          case 'title':
            return notebooks.title;
          case 'updatedAt':
            return notebooks.updatedAt;
          case 'createdAt':
          default:
            return notebooks.createdAt;
        }
      })();

      const results = search
        ? await db.select().from(notebooks).where(like(notebooks.title, `%${search}%`)).orderBy(order === 'desc' ? desc(orderColumn) : orderColumn).limit(limit).offset(offset)
        : await db.select().from(notebooks).orderBy(order === 'desc' ? desc(orderColumn) : orderColumn).limit(limit).offset(offset);

      return NextResponse.json(results);
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json({ 
        error: "Title is required and must be a non-empty string",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      title: body.title.trim(),
      cover: body.cover || null,
      studyMode: body.studyMode || 'write', // Add study mode support
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate cover if provided
    if (sanitizedData.cover !== null && typeof sanitizedData.cover !== 'object') {
      return NextResponse.json({
        error: "Cover must be a valid JSON object",
        code: "INVALID_COVER_FORMAT"
      }, { status: 400 });
    }

    // Validate studyMode if provided
    if (sanitizedData.studyMode && !['write', 'study'].includes(sanitizedData.studyMode)) {
      return NextResponse.json({
        error: "Study mode must be either 'write' or 'study'",
        code: "INVALID_STUDY_MODE"
      }, { status: 400 });
    }

    const newRecord = await db.insert(notebooks)
      .values(sanitizedData)
      .returning({
        id: notebooks.id,
        title: notebooks.title,
        cover: notebooks.cover,
        studyMode: notebooks.studyMode,
        createdAt: notebooks.createdAt,
        updatedAt: notebooks.updatedAt
      });

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(notebooks)
      .where(eq(notebooks.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Notebook not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Validate and sanitize fields if provided
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim() === '') {
        return NextResponse.json({ 
          error: "Title must be a non-empty string",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updates.title = body.title.trim();
    }

    if (body.cover !== undefined) {
      if (body.cover !== null && typeof body.cover !== 'object') {
        return NextResponse.json({
          error: "Cover must be a valid JSON object or null",
          code: "INVALID_COVER_FORMAT"
        }, { status: 400 });
      }
      updates.cover = body.cover;
    }

    if (body.studyMode !== undefined) {
      if (!['write', 'study'].includes(body.studyMode)) {
        return NextResponse.json({
          error: "Study mode must be either 'write' or 'study'",
          code: "INVALID_STUDY_MODE"
        }, { status: 400 });
      }
      updates.studyMode = body.studyMode;
    }

    const updated = await db.update(notebooks)
      .set(updates)
      .where(eq(notebooks.id, parseInt(id)))
      .returning({
        id: notebooks.id,
        title: notebooks.title,
        cover: notebooks.cover,
        studyMode: notebooks.studyMode,
        createdAt: notebooks.createdAt,
        updatedAt: notebooks.updatedAt
      });

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(notebooks)
      .where(eq(notebooks.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Notebook not found' 
      }, { status: 404 });
    }

    // First, delete all pages associated with this notebook
    await db.delete(pages)
      .where(eq(pages.notebookId, parseInt(id)));

    // Then delete the notebook
    const deleted = await db.delete(notebooks)
      .where(eq(notebooks.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Notebook and all its pages deleted successfully',
      deletedRecord: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}