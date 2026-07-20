import { NextResponse } from 'next/server'

import { generateLLM } from '../generateLLM';

export async function GET(req: Request) {
    // const llms = await generateLLMs(url);
    return NextResponse.json({ success: true });
}

export async function POST(req: Request) {
    const body = await req.json();
    const url = body.url;

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // const result = await generateLLM(url);

    return NextResponse.json({ success: true });
}