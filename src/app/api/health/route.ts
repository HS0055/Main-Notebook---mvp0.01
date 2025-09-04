import { NextResponse } from 'next/server';
import { db } from '@/db';
import { notebooks } from '@/db/schema';

export async function GET() {
  try {
    // Minimal check: attempt a trivial query
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = await db.select({ id: notebooks.id }).from(notebooks).limit(1);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}


