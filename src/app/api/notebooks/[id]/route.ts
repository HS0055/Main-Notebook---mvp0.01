import { NextResponse } from 'next/server';
import { db } from '@/db';
import { notebooks, pages } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: any) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const notebook = await db.select()
      .from(notebooks)
      .where(eq(notebooks.id, parseInt(id)))
      .limit(1);

    if (notebook.length === 0) {
      return NextResponse.json({ 
        error: 'Notebook not found' 
      }, { status: 404 });
    }

    return NextResponse.json(notebook[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: any) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const existingNotebook = await db.select()
      .from(notebooks)
      .where(eq(notebooks.id, parseInt(id)))
      .limit(1);

    if (existingNotebook.length === 0) {
      return NextResponse.json({ 
        error: 'Notebook not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, cover } = body;

    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json({ 
          error: "Title must be a non-empty string",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (cover !== undefined) {
      if (cover !== null && typeof cover !== 'object') {
        return NextResponse.json({ 
          error: "Cover must be a valid JSON object or null",
          code: "INVALID_COVER" 
        }, { status: 400 });
      }
      updates.cover = cover;
    }

    const updated = await db.update(notebooks)
      .set(updates)
      .where(eq(notebooks.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: any) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const existingNotebook = await db.select()
      .from(notebooks)
      .where(eq(notebooks.id, parseInt(id)))
      .limit(1);

    if (existingNotebook.length === 0) {
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
      deletedNotebook: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}