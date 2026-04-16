import React, { useState, useEffect } from 'react';
import API from '../api';
import { format, isBefore } from 'date-fns';

export default function Meetings() {
    const [meetings, setMeetings] = useState([]);
    const [filter, setFilter] = useState('upcoming'); // 'upcoming' | 'past' | 'canceled'

    const fetchMeetings = async () => {
        const { data } = await API.get('/meetings');
        return data;
    };

    useEffect(() => { 
        fetchMeetings().then(data => setMeetings(data)); 
    }, []);

    const handleCancel = async (id) => {
        if(window.confirm('Cancel this meeting?')) {
            await API.put(`/meetings/${id}/cancel`);
            fetchMeetings().then(data => setMeetings(data));
        }
    };

    // Filter logic
    const now = new Date();
    const filteredMeetings = meetings.filter(m => {
        const isPast = isBefore(new Date(m.start_time), now);
        if (filter === 'canceled') return m.status === 'cancelled';
        if (filter === 'upcoming') return m.status === 'active' && !isPast;
        return m.status === 'active' && isPast; // 'past'
    });

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Bookings</h2>
                
                {/* Tabs */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                            filter === 'upcoming' ? 'bg-white text-neutral-900' : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                            filter === 'past' ? 'bg-white text-neutral-900' : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        Past
                    </button>
                    <button
                        onClick={() => setFilter('canceled')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                            filter === 'canceled' ? 'bg-white text-neutral-900' : 'text-gray-400 hover:text-gray-200'
                        }`}
                    >
                        Canceled
                    </button>
                </div>
            </div>
            
            <div className="divide-y divide-white/10">
                {filteredMeetings.map(m => (
                    <div key={m.id} className="p-6 flex justify-between items-center">
                        <div>
                            <div className="flex items-center space-x-3 mb-1">
                                <span
                                    className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                                        m.status === 'active'
                                            ? 'bg-green-500/20 text-green-200'
                                            : m.status === 'cancelled'
                                                ? 'bg-red-500/20 text-red-200'
                                                : 'bg-white/10 text-gray-200'
                                    }`}
                                >
                                    {m.status}
                                </span>
                                <span className="font-semibold text-white">{format(new Date(m.start_time), 'EEEE, MMMM d, yyyy')}</span>
                            </div>
                            <p className="text-gray-300">{format(new Date(m.start_time), 'h:mm a')} - {format(new Date(m.end_time), 'h:mm a')}</p>
                            <p className="text-white font-medium mt-2">
                                {m.invitee_name} <span className="text-gray-400 font-normal">({m.invitee_email})</span>
                            </p>
                            <p className="text-sm text-gray-400">Event: {m.event_title}</p>
                        </div>
                        {m.status === 'active' && filter === 'upcoming' && (
                            <button
                                onClick={() => handleCancel(m.id)}
                                className="border border-white/20 text-gray-200 px-4 py-2 rounded-full text-sm font-semibold hover:border-white/40 transition-colors bg-white/5"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ))}
                {filteredMeetings.length === 0 && (
                    <p className="p-8 text-center text-gray-400">
                        No {filter === 'upcoming' ? 'upcoming' : filter === 'past' ? 'past' : 'canceled'} bookings found.
                    </p>
                )}
            </div>
        </div>
    );
}