import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pages, notebooks } from '@/db/schema';
import { eq, desc, asc, max } from 'drizzle-orm';

export async function GET(request: Request, { params }: any) {
  try {
    const { id: notebookId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!notebookId || isNaN(parseInt(notebookId))) {
      return NextResponse.json({ 
        error: "Valid notebookId is required",
        code: "INVALID_NOTEBOOK_ID" 
      }, { status: 400 });
    }

    // Verify notebook exists
    const notebook = await db.select()
      .from(notebooks)
      .where(eq(notebooks.id, parseInt(notebookId)))
      .limit(1);

    if (notebook.length === 0) {
      return NextResponse.json({ 
        error: 'Notebook not found' 
      }, { status: 404 });
    }

    // Get pages ordered by pageOrder ascending
    const results = await db.select({
        id: pages.id,
        notebookId: pages.notebookId,
        title: pages.title,
        leftContent: pages.leftContent,
        rightContent: pages.rightContent,
        paperStyle: pages.paperStyle,
        templateOverlay: pages.templateOverlay,
        pageOrder: pages.pageOrder,
        createdAt: pages.createdAt,
        updatedAt: pages.updatedAt,
      })
      .from(pages)
      .where(eq(pages.notebookId, parseInt(notebookId)))
      .orderBy(asc(pages.pageOrder))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: any) {
  try {
    const { id: notebookId } = await params;
    const body = await request.json();
    const { title, leftContent, rightContent, paperStyle } = body;

    // Validate required fields
    if (!notebookId || isNaN(parseInt(notebookId))) {
      return NextResponse.json({ 
        error: "Valid notebookId is required",
        code: "INVALID_NOTEBOOK_ID" 
      }, { status: 400 });
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    // Verify notebook exists
    const notebook = await db.select()
      .from(notebooks)
      .where(eq(notebooks.id, parseInt(notebookId)))
      .limit(1);

    if (notebook.length === 0) {
      return NextResponse.json({ 
        error: 'Notebook not found' 
      }, { status: 404 });
    }

    // Get the next page order by finding max pageOrder + 1
    const maxOrderResult = await db.select({ maxOrder: max(pages.pageOrder) })
      .from(pages)
      .where(eq(pages.notebookId, parseInt(notebookId)));

    const nextPageOrder = (maxOrderResult[0]?.maxOrder || 0) + 1;

    // Create new page
    const newPage = await db.insert(pages)
      .values({
        notebookId: parseInt(notebookId),
        title: title.trim(),
        leftContent: leftContent?.trim() || null,
        rightContent: rightContent?.trim() || null,
        paperStyle: paperStyle || null,
        pageOrder: nextPageOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newPage[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}