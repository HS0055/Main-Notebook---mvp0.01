import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pages, notebooks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: any) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const result = await db.select({
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
      notebook: {
        id: notebooks.id,
        title: notebooks.title,
        cover: notebooks.cover,
        createdAt: notebooks.createdAt,
        updatedAt: notebooks.updatedAt,
      }
    })
    .from(pages)
    .leftJoin(notebooks, eq(pages.notebookId, notebooks.id))
    .where(eq(pages.id, parseInt(id)))
    .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ 
        error: 'Page not found' 
      }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: any) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if page exists
    const existingPage = await db.select()
      .from(pages)
      .where(eq(pages.id, parseInt(id)))
      .limit(1);

    if (existingPage.length === 0) {
      return NextResponse.json({ 
        error: 'Page not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, leftContent, rightContent, pageOrder, paperStyle, templateOverlay } = body;

    // Build update object with only provided fields
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

    if (leftContent !== undefined) {
      updates.leftContent = leftContent;
    }

    if (rightContent !== undefined) {
      updates.rightContent = rightContent;
    }

    if (paperStyle !== undefined) {
      updates.paperStyle = paperStyle;
    }

    if (templateOverlay !== undefined) {
      updates.templateOverlay = templateOverlay;
    }

    if (pageOrder !== undefined) {
      if (!Number.isInteger(pageOrder) || pageOrder < 0) {
        return NextResponse.json({ 
          error: "Page order must be a non-negative integer",
          code: "INVALID_PAGE_ORDER" 
        }, { status: 400 });
      }
      updates.pageOrder = pageOrder;
    }

    const updated = await db.update(pages)
      .set(updates)
      .where(eq(pages.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
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

    // Check if page exists
    const existingPage = await db.select()
      .from(pages)
      .where(eq(pages.id, parseInt(id)))
      .limit(1);

    if (existingPage.length === 0) {
      return NextResponse.json({ 
        error: 'Page not found' 
      }, { status: 404 });
    }

    const deleted = await db.delete(pages)
      .where(eq(pages.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Page deleted successfully',
      deletedPage: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}