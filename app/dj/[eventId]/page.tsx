'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function DjQueuePage() {
    const params = useParams();
    const eventId = params.eventId as string;
    const [eventName, setEventName] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId) return;

        async function fetchEvent() {
            const res = await fetch(`/api/events/${eventId}`);

            if (!res.ok) {
                console.error('Failed to fetch event');
                return;
            }

            const data = await res.json();
            setEventName(data.name);
        }

        fetchEvent();

    }, [eventId])

    return (
        <div className='min-h-screen bg-gray-950 px-6 py-10 text-white'>
            <div className='mx-auto max-w-lg'>
                <h1 className='text-3xl font-semibold tracking-tight'>
                    DJ Queue
                </h1>
                <div className='flex items-center justify-between mt-6'>
                    <div>
                        <h2 className='text-xl font-semibold tracking-tight text-white'>{eventName}</h2>
                        <p className='mt-1 text-sm text-white/70'>
                            Event: <span className='font-mono text-slate-500'>{eventId}</span>
                        </p>
                    </div>

                    <span className='inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/20'>
                        Live
                    </span>
                </div>

                <div className='mt-8 rounded-2xl border border-white/10 bg-white/5 p-6'>
                    <p className='text-white/70'>Queue</p>
                </div>
            </div>

        </div>
    )
}