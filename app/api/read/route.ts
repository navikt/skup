import { NextResponse } from 'next/server';

export async function GET() {
    console.log('Starting GET request to fetch apps');
    try {
        const response = await fetch('https://skupapi.intern.nav.no/api/apps', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('Network response was not ok:', response.status, errorDetails);
            throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
        }

        const data = await response.json();
        console.log('Successfully fetched apps:', data);
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