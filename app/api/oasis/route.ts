import { NextResponse } from 'next/server';
import { getToken, validateToken, requestOboToken, parseAzureUserToken } from '@navikt/oasis';

export async function GET(request: Request) {
    const token = getToken(request);
    if (!token) {
        // Handle missing token
        console.error('Token is missing');
        return NextResponse.json({ error: 'Token is missing' }, { status: 400 });
    }

    const validation = await validateToken(token);
    if (!validation.ok) {
        // Handle validation error
        console.error('Token validation failed');
        return NextResponse.json({ error: 'Token validation failed' }, { status: 401 });
    }

    const obo = await requestOboToken(token, 'an:example:audience');
    if (!obo.ok) {
        // Handle OBO error
        console.error('OBO token request failed');
        return NextResponse.json({ error: 'OBO token request failed' }, { status: 500 });
    }

    const response = await fetch('https://example.com/api', {
        headers: { Authorization: `Bearer ${obo.token}` },
    });

    if (!response.ok) {
        // Handle fetch error
        console.error('API request failed');
        return NextResponse.json({ error: 'API request failed' }, { status: response.status });
    }

    const parse = parseAzureUserToken(token);
    if (parse.ok) {
        console.log(`User: ${parse.preferred_username} (${parse.NAVident})`);
        return NextResponse.json({ user: parse.preferred_username, NAVident: parse.NAVident });
    } else {
        // Handle token parsing error
        console.error('Token parsing failed');
        return NextResponse.json({ error: 'Token parsing failed' }, { status: 500 });
    }
}