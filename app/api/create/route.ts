import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const apiUrl = process.env.NODE_ENV === 'production'
        ? 'http://skup-backend/api/apps'
        : 'https://skupapi.intern.nav.no/api/apps';

    try {
        const appData = await request.json();
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appData),
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Network response was not ok:', response.status, errorDetails);
            throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Fetch failed:', error.message, error.stack);
            return NextResponse.json({ error: 'Fetch failed', message: error.message, stack: error.stack }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}