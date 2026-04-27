import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

const BACKEND = 'https://jra-platform.onrender.com/api';

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
    resHeaders.set('content-type', 'application/json');
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) resHeaders.set('set-cookie', setCookie);

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Server is waking up, please wait 30 seconds and try again' },
        { status: 503 }
      );
    }

    return NextResponse.json(json, { status: res.status, headers: resHeaders });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Could not reach server, please try again' },
      { status: 503 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
