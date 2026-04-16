import React, { useState, useEffect } from 'react';
import API from '../api';
import { Clock, Globe } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Availability() {
    const [schedule, setSchedule] = useState(DAYS.map((d, i) => ({ day_of_week: i, active: false, start_time: '09:00', end_time: '17:00' })));
    
    // Auto-detect browser timezone
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    useEffect(() => {
        const loadAvailability = async () => {
            const { data } = await API.get('/availability');
            if (data.length > 0) {
                // Rebuild defaults inside the effect to avoid stale closures.
                const newSchedule = DAYS.map((_, i) => ({
                    day_of_week: i,
                    active: false,
                    start_time: '09:00',
                    end_time: '17:00',
                }));
                data.forEach(d => {
                    newSchedule[d.day_of_week] = { ...d, active: true, start_time: d.start_time.substring(0, 5), end_time: d.end_time.substring(0, 5) };
                });
                setSchedule(newSchedule);
            }
        };
        loadAvailability();
    }, []);

    const save = async () => {
        await API.post('/availability', { availabilities: schedule });
        alert(`Availability & Timezone (${timezone}) Saved!`);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-white">Availability</h2>
                    <p className="text-sm text-gray-400 mt-1">Configure times when you are available for bookings.</p>
                </div>
                <button
                    onClick={save}
                    className="bg-white/5 border border-white/10 text-gray-200 px-4 py-2 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                    Save Changes
                </button>
            </div>

            {/* Timezone Selector */}
            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="text-gray-500">
                    <Globe size={16} />
                </div>
                <label className="text-gray-300 font-medium mr-2 min-w-[70px]">Timezone</label>
                <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-white/10 rounded-lg p-2.5 outline-none focus:border-white text-sm text-gray-200"
                >
                    <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                        {Intl.DateTimeFormat().resolvedOptions().timeZone} (Local)
                    </option>
                    <option value="America/New_York">America/New_York (EST/EDT)</option>
                    <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                </select>
            </div>

            <div className="divide-y divide-white/10">
                {schedule.map((day, idx) => {
                    const isOn = !!day.active;
                    const toggleId = `toggle-${idx}`;

                    return (
                        <div key={idx} className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                                <label htmlFor={toggleId} className="relative inline-flex h-6 w-11 cursor-pointer">
                                    <input
                                        id={toggleId}
                                        type="checkbox"
                                        checked={isOn}
                                        onChange={(e) => {
                                            const newSched = [...schedule];
                                            newSched[idx].active = e.target.checked;
                                            setSchedule(newSched);
                                        }}
                                        className="sr-only peer"
                                    />
                                    <span className="absolute inset-0 rounded-full bg-white/10 transition-colors peer-checked:bg-white" />
                                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                                </label>
                                <span className={`font-semibold ${isOn ? 'text-white' : 'text-gray-500'}`}>{DAYS[idx]}</span>
                            </div>

                            {isOn ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                        <Clock size={14} className="text-gray-500" />
                                        <input
                                            type="time"
                                            value={day.start_time}
                                            onChange={(e) => {
                                                const newSched = [...schedule];
                                                newSched[idx].start_time = e.target.value;
                                                setSchedule(newSched);
                                            }}
                                            className="bg-transparent outline-none text-sm text-gray-200"
                                        />
                                    </div>
                                    <span className="text-gray-500">-</span>
                                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                        <Clock size={14} className="text-gray-500" />
                                        <input
                                            type="time"
                                            value={day.end_time}
                                            onChange={(e) => {
                                                const newSched = [...schedule];
                                                newSched[idx].end_time = e.target.value;
                                                setSchedule(newSched);
                                            }}
                                            className="bg-transparent outline-none text-sm text-gray-200"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <span className="text-gray-500 italic text-sm">Unavailable</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}