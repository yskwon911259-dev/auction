import { NextResponse } from 'next/server';
import { fetchOnBidProperties } from '@/lib/onbid-api';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    try {
        const data = await fetchOnBidProperties(params);
        return NextResponse.json(data);
    } catch (error) {
        console.error('OnBid API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
