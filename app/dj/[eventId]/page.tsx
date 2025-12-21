'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon, LinkIcon } from '@heroicons/react/20/solid';


export default function DjQueuePage() {
    const params = useParams();

    const eventId = params.eventId as string;
    const [eventName, setEventName] = useState<string | null>(null);

    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    function formatTimeAgo(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();

        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'short' });

        if (seconds < 60) {
            return rtf.format(-seconds, 'second');
        }

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return rtf.format(-minutes, 'minute');
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return rtf.format(-hours, 'hour');
        }

        const days = Math.floor(hours / 24);
        return rtf.format(-days, 'day');
    }

    async function fetchRequests(silent = false) {
        if (!silent) setLoading(true);

        const res = await fetch(`/api/events/${eventId}/requests`);
        if (!res.ok) {
            console.error('Failed to fetch requests');
            setLoading(false);
            return;
        }

        const data = await res.json();

        setRequests((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(data)) {
                return prev;
            }
            return data;
        });

        if (!silent) setLoading(false);
    }

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

    useEffect(() => {
        if (!eventId) return;

        fetchRequests();
    }, [eventId]);

    useEffect(() => {
        if (!eventId) return;

        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchRequests(true);
            }
        }, 5000);
    }, [eventId]);

    async function updateStatus(requestId: string, status: 'PLAYED' | 'SKIPPED' | 'PENDING') {
        const res = await fetch(`/api/requests/${requestId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (!res.ok) {
            console.error('Failed to update status');
            return;
        }

        const refreshed = await fetch(`/api/events/${eventId}/requests`);
        setRequests(await refreshed.json());
    }

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
                    {loading && (
                        <p className='text-sm text-gray-400'>Loading queue…</p>
                    )}

                    {!loading && requests.length === 0 && (
                        <p className='text-sm text-gray-400'>No requests yet.</p>
                    )}
                    <ul role='list' className='divide-y divide-white/10'>
                        {requests.map((req) => <li key={req.id} className='flex items-center justify-between gap-x-6 py-5'>
                            <div className='min-w-0'>
                                <div className='flex items-start gap-x-3'>
                                    <p className='text-sm/6 font-semibold dark:text-white'>{req.title} - {req.artist}</p>
                                    <p className={`
                                        mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium
                                        ${req.status === 'PENDING' && 'bg-emerald-500/15 text-emerald-300 inset-ring inset-ring-emerald-500/20'}
                                        ${req.status === 'PLAYED' && 'bg-sky-500/15 text-sky-300 inset-ring inset-ring-sky-500/20'}
                                        ${req.status === 'SKIPPED' && 'bg-gray-500/15 text-gray-400 inset-ring inset-ring-gray-500/20'}
                                        `}>
                                        {req.status}
                                    </p>
                                </div>
                                <div className='mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500 dark:text-gray-400'>
                                    <p className='whitespace-nowrap'>{formatTimeAgo(req.createdAt)}</p>
                                    <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                                        <circle r={1} cx={1} cy={1} />
                                    </svg>
                                    <p className="truncate">Requested by Annonymous</p>
                                </div>
                            </div>
                            <div className='flex flex-none items-center gap-x-4'>
                                <a className='inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:flex dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20'>Tidal <LinkIcon className='size-4' /> </a>
                                <Menu as='div' className='relative flex-none'>
                                    <MenuButton>
                                        <span className='absolute -inset-2.5' />
                                        <span className='sr-only'>Open options</span>
                                        <EllipsisVerticalIcon aria-hidden='true' className='size-5' />
                                    </MenuButton>
                                    <MenuItems transition className='absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg outline-1 outline-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10'>
                                        <MenuItem>
                                            <button onClick={() => updateStatus(req.id, 'PENDING')} className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden dark:text-white dark:data-focus:bg-white/5">Set Pending</button>
                                        </MenuItem>
                                        <MenuItem>
                                            <button onClick={() => updateStatus(req.id, 'PLAYED')} className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden dark:text-white dark:data-focus:bg-white/5">Set Played</button>
                                        </MenuItem>
                                        <MenuItem>
                                            <button onClick={() => updateStatus(req.id, 'SKIPPED')} className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden dark:text-white dark:data-focus:bg-white/5">Set Skipped</button>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>
                        </li>)}
                    </ul>
                </div>
            </div>

        </div>
    )
}