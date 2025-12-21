'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function generateCode() {
    return Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();
}

export default function NewEventPage() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [code, setCode] = useState(generateCode());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function createEvent(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Event name required');
            return;
        }

        setLoading(true);

        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.trim(),
                code: code.trim(),
            }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Failed to create event');
            setLoading(false);
            return;
        }

        const event = await res.json();

        router.push(`/dj/${event.id}`);
    }

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">
            <div className="mx-auto max-w-md">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Create Event
                </h1>

                <form onSubmit={createEvent} className="mt-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white/80">
                            Event name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Friday Night Party"
                            className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80">
                            Event code
                        </label>
                        <div className="mt-1 flex gap-2">
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="w-full rounded-md bg-white/5 px-3 py-2 font-mono tracking-widest text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setCode(generateCode())}
                                className="rounded-md bg-white/10 px-3 text-sm hover:bg-white/20"
                            >
                                Regenerate
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Creating…' : 'Create Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}