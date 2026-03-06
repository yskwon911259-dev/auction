import { NextResponse } from 'next/server';
import { fetchOnBidData, OnbidApiType } from '@/lib/onbid-api';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get('type') as OnbidApiType) || 'general';

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        if (key !== 'type') {
            params[key] = value;
        }
    });

    try {
        const data = await fetchOnBidData(type, params);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`OnBid API Proxy Error [${type}]:`, error.message);
        return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
    }
}
