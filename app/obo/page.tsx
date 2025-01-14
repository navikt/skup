"use client";
import React, { useState, useEffect } from 'react';
import Read from '../components/crud/read';
import Create from '../components/obocrud/create';
import Delete from '../components/crud/delete';

interface App {
    app_id: string;
    app_name: string;
    app_owner: string;
    is_active: boolean;
    created_at: string;
}

export default function MainSection() {
    const [apps, setApps] = useState<App[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchApps = async () => {
        try {
            const response = await fetch('/api/oboread')
            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Network response was not ok:', response.status, errorDetails);
                throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
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
            <Delete onAppDeleted={fetchApps} />
        </div>
    );
}