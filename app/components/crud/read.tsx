"use client";
import React, { useState, useEffect } from "react";

interface App {
    app_id: string;
    app_name: string;
    is_active: boolean;
    created_at: string;
}

export default function GetApps({ apps, error }: { apps: App[], error: string | null }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (apps.length > 0 || error) {
            setLoading(false);
        }
    }, [apps, error]);

    return (
        <>
            <h1 className="text-4xl font-bold mb-8">Apper</h1>
            {loading ? null : (
                <>
                    {error ? (
                        <div>Uff da: {error}</div>
                    ) : (
                        <>
                            {(!apps || apps.length === 0) ? (
                                <div>Fant ingen apper</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {apps.map((app) => (
                                        <a key={app.app_id} href="#" className="block w-full">
                                            <div
                                                className="bg-white shadow-lg rounded-lg p-6 w-full transform transition-transform hover:scale-105 hover:bg-gray-100 h-full flex flex-col">
                                                <h2 className="text-2xl font-semibold mb-2">{app.app_name}</h2>
                                                <p className="text-gray-700">Active: {app.is_active ? 'Yes' : 'No'}</p>
                                                <p className="text-gray-700">Created at: {new Date(app.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}