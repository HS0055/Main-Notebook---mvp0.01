import { NextResponse } from 'next/server';
import { db } from '@/db';
import { notebooks, pages } from '@/db/schema';
import { like, or, eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query) {
      return NextResponse.json({ 
        error: "Search query is required",
        code: "MISSING_QUERY" 
      }, { status: 400 });
    }

    const searchTerm = `%${query.trim()}%`;
    const results: any[] = [];

    // Search notebooks by title
    const notebookResults = await db.select({
      id: notebooks.id,
      title: notebooks.title,
      cover: notebooks.cover,
      createdAt: notebooks.createdAt,
      updatedAt: notebooks.updatedAt
    })
    .from(notebooks)
    .where(like(notebooks.title, searchTerm))
    .orderBy(desc(notebooks.updatedAt));

    // Add notebook results with type indicator
    notebookResults.forEach(notebook => {
      results.push({
        ...notebook,
        type: 'notebook'
      });
    });

    // Search pages by title, leftContent, and rightContent
    const pageResults = await db.select({
      id: pages.id,
      notebookId: pages.notebookId,
      title: pages.title,
      leftContent: pages.leftContent,
      rightContent: pages.rightContent,
      pageOrder: pages.pageOrder,
      createdAt: pages.createdAt,
      updatedAt: pages.updatedAt,
      notebookTitle: notebooks.title,
      notebookCover: notebooks.cover
    })
    .from(pages)
    .leftJoin(notebooks, eq(pages.notebookId, notebooks.id))
    .where(
      or(
        like(pages.title, searchTerm),
        like(pages.leftContent, searchTerm),
        like(pages.rightContent, searchTerm)
      )
    )
    .orderBy(desc(pages.updatedAt));

    // Add page results with type indicator and parent notebook info
    pageResults.forEach(page => {
      results.push({
        id: page.id,
        notebookId: page.notebookId,
        title: page.title,
        leftContent: page.leftContent,
        rightContent: page.rightContent,
        pageOrder: page.pageOrder,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        type: 'page',
        notebook: {
          id: page.notebookId,
          title: page.notebookTitle,
          cover: page.notebookCover
        }
      });
    });

    // Sort combined results by updatedAt desc
    results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Apply pagination to combined results
    const paginatedResults = results.slice(offset, offset + limit);

    return NextResponse.json(paginatedResults);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}