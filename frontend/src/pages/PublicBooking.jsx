import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isToday } from 'date-fns';
import { Clock } from 'lucide-react';

export default function PublicBooking() {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [form, setForm] = useState({ name: '', email: '' });
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        API.get(`/slots/${slug}?date=${format(new Date(), 'yyyy-MM-dd')}`)
           .then(res => setEvent(res.data.eventType))
           .catch(() => alert('Event not found'));
    }, [slug]);

    useEffect(() => {
        if (selectedDate) {
            API.get(`/slots/${slug}?date=${format(selectedDate, 'yyyy-MM-dd')}`)
               .then(res => setSlots(res.data.slots));
        }
    }, [selectedDate, slug]);

    if (!event) return <div className="text-center mt-20">Loading...</div>;

    const daysInMonth = eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });

    const handleBook = async (e) => {
        e.preventDefault();
        await API.post('/bookings', { event_type_id: event.id, invitee_name: form.name, invitee_email: form.email, start_time: selectedSlot });
        setConfirmed(true);
    };

    if (confirmed) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
                <div className="bg-white/5 border border-white/10 p-10 rounded-2xl shadow-md max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Confirmed</h2>
                    <p className="text-gray-400 mb-6">You are scheduled with Admin User.</p>
                    <div className="text-left bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="font-semibold text-white">{event.title}</p>
                        <p className="text-gray-300 flex items-center mt-2"><Clock size={16} className="mr-2"/> {format(new Date(selectedSlot), 'EEEE, MMMM d, yyyy @ h:mm a')}</p>
                    </div>
                    <Link
                        to="/"
                        className="inline-block mt-6 bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-white/90 transition-colors"
                    >
                        Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center py-10 px-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg max-w-4xl w-full flex overflow-hidden">
                
                {/* Left Panel: Event Info */}
                <div className="w-1/3 bg-neutral-950/30 p-8 border-r border-white/10">
                    <h3 className="text-gray-400 font-semibold mb-2">Admin User</h3>
                    <h1 className="text-2xl font-bold text-white mb-4">{event.title}</h1>
                    <p className="text-gray-400 flex items-center"><Clock size={18} className="mr-2"/> {event.duration} min</p>
                    {selectedDate && <p className="mt-4 text-white font-medium">{format(selectedDate, 'EEEE, MMMM d')}</p>}
                    {selectedSlot && <p className="text-gray-300">{format(new Date(selectedSlot), 'h:mm a')}</p>}
                </div>

                {/* Right Panel: Calendar / Form */}
                <div className="w-2/3 p-8 bg-neutral-950 flex">
                    {!selectedSlot ? (
                        <>
                            <div className="w-1/2 pr-4">
                                <h2 className="text-lg font-bold mb-6 text-white">Select a Date & Time</h2>
                                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2 text-gray-500 font-medium">
                                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
                                </div>
                                <div className="grid grid-cols-7 gap-2 text-center">
                                    {daysInMonth.map((day, i) => {
                                        const disabled = isBefore(day, new Date()) && !isToday(day);
                                        const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                                        return (
                                            <button 
                                                key={i} 
                                                disabled={disabled}
                                                onClick={() => setSelectedDate(day)}
                                                style={i === 0 ? { gridColumnStart: day.getDay() + 1 } : {}}
                                                className={`p-2 rounded-full w-10 h-10 mx-auto flex items-center justify-center text-sm font-semibold transition-colors
                                                    ${disabled ? 'text-gray-600 cursor-not-allowed' : 'text-white bg-white/5 hover:bg-white/10'}
                                                    ${isSelected ? 'bg-white text-black hover:bg-white/90' : ''}
                                                `}>
                                                {format(day, 'd')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="w-1/2 pl-4 border-l border-white/10 overflow-y-auto max-h-96">
                                {selectedDate && slots.length === 0 && <p className="text-gray-400 mt-4 text-center">No times available.</p>}
                                {selectedDate && slots.map(slot => (
                                    <button 
                                        key={slot} 
                                        onClick={() => setSelectedSlot(slot)}
                                        className="w-full mb-3 py-3 border border-white/10 text-white font-bold rounded hover:border-white/90 hover:text-white transition-colors bg-white/5">
                                        {format(new Date(slot), 'h:mm a')}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleBook} className="w-full">
                            <h2 className="text-xl font-bold mb-6 text-white">Enter Details</h2>
                            <div className="mb-4">
                                <label className="block text-gray-300 font-medium mb-2">Name</label>
                                <input
                                    required
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-white"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-300 font-medium mb-2">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-white"
                                />
                            </div>
                            <button type="submit" className="bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-white/90 transition-colors">
                                Schedule Event
                            </button>
                            <button type="button" onClick={() => setSelectedSlot(null)} className="ml-4 text-gray-400 hover:text-gray-200">
                                Back
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

