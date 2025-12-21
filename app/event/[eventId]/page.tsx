'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function EventPage() {
    const params = useParams();
    const eventId = params.eventId as string;

    const [code, setCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [queue, setQueue] = useState<any[]>([]);

    async function submitRequest() {
        setError('');

        const res = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId,
                code,
                title,
                artist
            }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Failed to submit request');
            return;
        }

        setTitle('');
        setArtist('');
        fetchQueue();
    }

    async function fetchQueue() {
        const res = await fetch(`/api/events/${eventId}/queue`);

        const data = await res.json();
        console.log('queue data: ', data);

        setQueue(data);
    }

    async function verifyCode() {
        setError('');

        const res = await fetch(`/api/events/${eventId}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || 'Invalid code');
            return;
        }

        setIsVerified(true);
    }

    useEffect(() => {
        if (isVerified) fetchQueue();
    }, [isVerified]);

    return (
        <div className="min-h-screen bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-gray-950">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-5xl font-semibold tracking-tight text-gray-950 sm:text-7xl dark:text-white">
                    Request a Song
                </h2>
                <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
                    View currently requested songs. Search and add your song request. Songs must be available on Tidal.
                </p>
            </div>



            {/* Not verified enter code */}
            {!isVerified && (
                <><div className='mx-auto max-w-md mt-4'>
                    <div className='w-full max-w-md lg:col-span-5 pt-2'>
                        <div className='flex gap-x-4'>
                            <input
                                className="min-w-0 flex-auto rounded-md bg-white px-3.5 py-2 text-base text-gray-950 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                placeholder='Enter event code'
                                value={code}
                                onChange={(e) => setCode(e.target.value)} />
                            <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500" onClick={() => verifyCode()}>
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
                </>
            )}


            {isVerified && (
                <><div className='mx-auto max-w-md mt-8'>
                    <form className='w-full max-w-md lg:col-span-5 pt2'>
                        <div className='flex gap-x-4'>
                            <input
                                className="min-w-0 flex-auto rounded-md bg-white px-3.5 py-2 text-base text-gray-950 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                placeholder="Song title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                className="min-w-0 flex-auto rounded-md bg-white px-3.5 py-2 text-base text-gray-950 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                placeholder="Artist"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                            />
                            <button
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                                onClick={submitRequest}>Submit</button>
                        </div>
                    </form>

                    <h2 className='text-4xl font-semibold tracking-tight text-pretty my-4 text-gray-950 dark:text-white'>Queue</h2>
                    <ul role='list' className='divide-y divide-gray-100 dark:divide-white/5'>
                        {queue.map((song) => (
                            <li key={song.id} className='flex justify-between gap-x-6 py-5'>
                                <div className='flex min-w-0 gap-x-4'>
                                    <img alt='album cover art' src={'https://imgs.search.brave.com/IE4PK76SlSrHtXSiK7HZURBpNXF-mHPIzF1iAvHI13A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzk0Lzlj/LzAxLzk0OWMwMTRj/ODEzYmMwMzE1MjBk/ODJhZjM5MDVhNGYw/LmpwZw'} className='size-12 flex-none rounded-full bg-gray-50 dark:bg-gray-800 dark:outline dark:-outline-offset-1 dark:outline-white/10' />
                                    <div className='min-w-0 flex-auto'>
                                        <p className="text-sm/6 font-semibold text-gray-950 dark:text-white">{song.title}</p>
                                        <p className="mt-1 truncate text-xs/5 text-gray-500 dark:text-gray-400">{song.artist}</p>
                                    </div>
                                </div>
                                <div className='hidden shrink-0 sm:flex sm:flex-col sm:items-end'>
                                    <p className='text-sm/6 text-gray-950 dark:text-white'>{song.status}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                </>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* footer */}
            <footer>
                <div className="mt-16 border-t border-gray-950/10 pt-8 sm:mt-20 lg:mt-24 dark:border-white/10">
                    <p className="text-sm/6 text-gray-600 dark:text-gray-400">
                        &copy; 2026 Dylan Rotich. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}