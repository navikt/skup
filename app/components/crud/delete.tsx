"use client";
import React, { useState } from "react";
import { UNSAFE_Combobox, Button, Alert, AlertProps } from "@navikt/ds-react";

interface App {
    app_id: string;
    app_name: string;
    is_active: boolean;
    created_at: string;
}

export default function DeleteApp({ onAppCreated }: { onAppCreated: () => void }) {
    const [apps, setApps] = useState<App[]>([]);
    const [selectedApp, setSelectedApp] = useState<App | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const fetchApps = async () => {
        try {
            const response = await fetch(
                window.location.hostname === 'localhost' ? 'https://skupapi.intern.nav.no/api/apps' : 'https://skupapi.ansatt.nav.no/api/apps',
                {
                    credentials: window.location.hostname === 'localhost' ? 'omit' : 'include',
                }
            );
            if (!response.ok) {
                throw new Error('Kunne ikke hente appene. Vennligst sjekk nettverkstilkoblingen din og prøv igjen.');
            }
            const data: App[] = await response.json();
            setApps(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('En ukjent feil skjedde');
            }
        }
    };

    const handleDelete = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedApp) {
            setError('Du må velge hvilken app som skal slettes');
            return;
        }

        try {
            const response = await fetch(
                window.location.hostname === 'localhost' ? `https://skupapi.intern.nav.no/api/apps/${selectedApp.app_id}` : `https://skupapi.ansatt.nav.no/api/apps/${selectedApp.app_id}`,
                {
                    method: 'DELETE',
                    credentials: window.location.hostname === 'localhost' ? 'omit' : 'include',
                }
            );
            if (!response.ok) {
                throw new Error('Klarte ikke å slette appen. Sjekk nettverkstilkoblingen din og prøv igjen.');
            }
            setSuccess(true);
            setError(null);
            setSelectedApp(null); // Clear the combobox
            onAppCreated(); // Notify the parent component to update the list of apps
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('En ukjent feil skjedde');
            }
            setSuccess(false);
        }
    };

    const handleClick = () => {
        fetchApps();
    };

    const options = apps.map(app => ({
        label: app.app_name,
        value: app.app_name, // Use app_name as the value for display
        app: app // Store the full app object
    }));

    return (
        <div style={{ maxWidth: "600px", marginTop: "60px" }}>
            <h1 className="text-4xl font-bold mb-8">Slett app</h1>
            <form onSubmit={handleDelete} className="grid grid-cols-1 gap-6 mb-5" onClick={handleClick}>
                <UNSAFE_Combobox
                    label="App"
                    options={options}
                    selectedOptions={selectedApp ? [selectedApp.app_name] : []}
                    onToggleSelected={(option, isSelected) => {
                        if (isSelected) {
                            const app = options.find(opt => opt.value === option)?.app;
                            setSelectedApp(app || null);
                        } else {
                            setSelectedApp(null);
                        }
                    }}
                />
                <Button type="submit" variant="primary">Slett</Button>
            </form>
            {success && (
                <AlertWithCloseButton variant="success">
                    App slettet
                </AlertWithCloseButton>
            )}
            {error && (
                <AlertWithCloseButton variant="error">
                    Uff, fikk ikke slettet appen: {error}
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