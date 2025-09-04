import { NextResponse } from 'next/server';
import { db } from '@/db';
import { bookmarks, notebooks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { notebookId, userId } = body;

    // Validate required fields
    if (!notebookId) {
      return NextResponse.json({ 
        error: "Notebook ID is required",
        code: "MISSING_NOTEBOOK_ID" 
      }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ 
        error: "User ID is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    // Validate notebookId is a valid integer
    if (isNaN(parseInt(notebookId))) {
      return NextResponse.json({ 
        error: "Valid notebook ID is required",
        code: "INVALID_NOTEBOOK_ID" 
      }, { status: 400 });
    }

    // Validate notebook exists
    const notebook = await db.select()
      .from(notebooks)
      .where(eq(notebooks.id, parseInt(notebookId)))
      .limit(1);

    if (notebook.length === 0) {
      return NextResponse.json({ 
        error: "Notebook not found",
        code: "NOTEBOOK_NOT_FOUND" 
      }, { status: 404 });
    }

    // Check if bookmark already exists
    const existingBookmark = await db.select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.notebookId, parseInt(notebookId)),
          eq(bookmarks.userId, userId.toString().trim())
        )
      )
      .limit(1);

    if (existingBookmark.length > 0) {
      // Bookmark exists, delete it (unbookmark)
      const deleted = await db.delete(bookmarks)
        .where(
          and(
            eq(bookmarks.notebookId, parseInt(notebookId)),
            eq(bookmarks.userId, userId.toString().trim())
          )
        )
        .returning();

      return NextResponse.json({ 
        bookmarked: false,
        message: "Notebook unbookmarked successfully",
        deletedBookmark: deleted[0]
      }, { status: 200 });
    } else {
      // Bookmark doesn't exist, create it (bookmark)
      const newBookmark = await db.insert(bookmarks)
        .values({
          notebookId: parseInt(notebookId),
          userId: userId.toString().trim(),
          createdAt: new Date().toISOString()
        })
        .returning();

      return NextResponse.json({ 
        bookmarked: true,
        message: "Notebook bookmarked successfully",
        bookmark: newBookmark[0]
      }, { status: 201 });
    }

  } catch (error) {
    console.error('POST bookmark toggle error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}