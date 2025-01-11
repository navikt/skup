"use client";
import React, { useState, useEffect } from 'react';
import Read from './components/crud/read';
import Create from './components/crud/create';
import Delete from './components/crud/delete';

interface App {
    app_id: string;
    app_name: string;
    is_active: boolean;
    created_at: string;
}

export default function MainSection() {
    const [apps, setApps] = useState<App[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchApps = async () => {
        try {
            const response = await fetch('https://skupapi.intern.nav.no/api/apps');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: App[] = await response.json();
            setApps(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    return (
        <div className="container mx-auto pt-6 pb-12">
            <Read apps={apps} error={error} />
            <Create onAppCreated={fetchApps} />
            <Delete onAppCreated={fetchApps} />
        </div>
    );
}