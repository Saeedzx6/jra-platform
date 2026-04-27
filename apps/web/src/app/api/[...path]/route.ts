import { NextRequest, NextResponse } from 'next/server';

const BACKEND = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api').replace(/\/$/, '');

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = `${BACKEND}/${path}${req.nextUrl.search}`;

  const headers = new Headers();
  const ct = req.headers.get('content-type');
  if (ct) headers.set('content-type', ct);
  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);
  const cookie = req.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);

  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined;

  try {
    const res = await fetch(url, { method: req.method, headers, body });
    const text = await res.text();

    const resHeaders = new Headers();
    const contentType = res.headers.get('content-type') ?? '';
    resHeaders.set('content-type', 'application/json');
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) resHeaders.set('set-cookie', setCookie);

    // If backend returned non-JSON (e.g. HTML error page), return a clean error
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Server is starting up, please try again in 30 seconds' },
        { status: 503 }
      );
    }

    return new NextResponse(text, { status: res.status, headers: resHeaders });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server is starting up, please try again in 30 seconds' },
      { status: 503 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
