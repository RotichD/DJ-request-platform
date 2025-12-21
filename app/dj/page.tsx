'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Event = {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    createdAt: string;
};

export default function DjDashboardPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            const res = await fetch('/api/events');
            if (!res.ok) {
                console.error('Failed to fetch events');
                setLoading(false);
                return;
            }

            const data = await res.json();
            setEvents(data);
            setLoading(false);
        }

        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">
            <div className="mx-auto max-w-3xl">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        My Events
                    </h1>

                    <Link
                        href="/dj/new"
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
                    >
                        New Event
                    </Link>
                </div>

                <div className="mt-8 rounded-xl border border-white/10 bg-white/5">
                    {loading && (
                        <p className="p-4 text-sm text-white/60">Loading events…</p>
                    )}

                    {!loading && events.length === 0 && (
                        <p className="p-4 text-sm text-white/60">
                            No events yet. Create one to get started.
                        </p>
                    )}

                    <ul className="divide-y divide-white/5">
                        {events.map((event) => (
                            <li
                                key={event.id}
                                className="flex items-center justify-between px-4 py-4"
                            >
                                <div>
                                    <p className="font-medium">{event.name}</p>
                                    <p className="mt-1 text-sm text-white/60">
                                        Code:{' '}
                                        <span className="font-mono tracking-widest">
                                            {event.code}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${event.isActive
                                                ? 'bg-emerald-500/15 text-emerald-300'
                                                : 'bg-gray-500/15 text-gray-400'
                                            }`}
                                    >
                                        {event.isActive ? 'Live' : 'Ended'}
                                    </span>

                                    <Link
                                        href={`/dj/${event.id}`}
                                        className="text-sm text-indigo-400 hover:text-indigo-300"
                                    >
                                        Open
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}