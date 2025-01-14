"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Alert, AlertProps } from "@navikt/ds-react";

interface App {
    app_id: string;
    app_name: string;
    is_active: boolean;
    created_at: string;
    app_owner?: string;
}

export default function CreateApp({ onAppCreated }: { onAppCreated: () => void }) {
    const [appName, setAppName] = useState("");
    const [isActive,] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [appOwner, setAppOwner] = useState<string | null>("Testbruker");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/me');
                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }
                const data = await response.json();
                setAppOwner(data.user.preferred_username);
            } catch (err) {
                if (process.env.NODE_ENV !== 'development') {
                    console.error('Error fetching user information:', err);
                }
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    app_name: appName,
                    is_active: isActive,
                    created_at: new Date().toISOString(),
                    app_owner: appOwner,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: App = await response.json();
            console.log('App created:', data);
            setSuccess(true);
            setError(null);
            setAppName(''); // Clear the input field
            onAppCreated(); // Notify the parent component to update the list of apps
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setSuccess(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", marginTop: "60px" }}>
            <h1 className="text-4xl font-bold mb-8">Legg til app</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 mb-5">
                <TextField
                    label="Navn"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    required
                />
                <Button type="submit" className="max-w-[200px]" variant="primary">Legg til</Button>
            </form>
            {success && (
                <AlertWithCloseButton variant="success">
                    App lagt til
                </AlertWithCloseButton>
            )}
            {error && (
                <AlertWithCloseButton variant="error">
                    Uff, fikk ikke lagt til appen: {error}
                </AlertWithCloseButton>
            )}
        </div>
    );
}

const AlertWithCloseButton = ({
                                  children,
                                  variant,
                              }: {
    children?: React.ReactNode;
    variant: AlertProps["variant"];
}) => {
    const [show, setShow] = React.useState(true);

    return show ? (
        <Alert variant={variant} closeButton onClose={() => setShow(false)}>
            {children}
        </Alert>
    ) : null;
};