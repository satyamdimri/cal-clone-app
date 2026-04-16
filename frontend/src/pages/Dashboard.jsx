import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Clock, Link as LinkIcon, Trash, Pencil, Plus, Search } from 'lucide-react';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [query, setQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', duration: 15, slug: '' });

    const fetchEvents = async () => {
        const { data } = await API.get('/event-types');
        return data;
    };

    useEffect(() => { 
        fetchEvents().then(data => setEvents(data));
    }, []);

    const filteredEvents = (Array.isArray(events) ? events : []).filter(ev => {
        if (!query.trim()) return true;
        return (
            (ev.title || '').toLowerCase().includes(query.trim().toLowerCase()) ||
            (ev.slug || '').toLowerCase().includes(query.trim().toLowerCase())
        );
    });

    const handleDelete = async (id) => {
        if(window.confirm('Delete this event?')) {
            await API.delete(`/event-types/${id}`);
            fetchEvents().then(data => setEvents(data));
        }
    }

    const openNewModal = () => {
        setFormData({ id: null, title: '', duration: 15, slug: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (ev) => {
        setFormData({ id: ev.id, title: ev.title, duration: ev.duration, slug: ev.slug });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) await API.put(`/event-types/${formData.id}`, formData);
            else await API.post('/event-types', formData);
            
            setIsModalOpen(false);
            fetchEvents().then(data => setEvents(data));
        } catch (error) {
            console.log(error);
            const apiMessage = error?.response?.data?.error;
            alert(apiMessage || 'Error saving event. Please try again.');
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-white">Event types</h2>
                    <p className="text-sm text-gray-400 mt-1">Configure different events for people to book on your calendar.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-72">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <Search size={16} />
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search"
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-9 pr-4 text-sm text-gray-200 placeholder:text-gray-500 outline-none focus:border-white"
                        />
                    </div>
                    <button
                        onClick={openNewModal}
                        className="flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-white/90 transition-colors"
                    >
                        <Plus size={18} /> New
                    </button>
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
                    <p className="text-gray-500">No event types yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredEvents.map(ev => (
                        <div
                            key={ev.id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col hover:border-white/30 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-white mb-1">{ev.title}</h3>
                            <p className="text-gray-400 flex items-center mb-6">
                                <Clock size={16} className="mr-2" /> {ev.duration} mins
                            </p>

                            <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/10">
                                <Link
                                    to={`/book/${ev.slug}`}
                                    target="_blank"
                                    className="text-white flex items-center text-sm font-medium hover:underline"
                                >
                                    <LinkIcon size={14} className="mr-1" /> View Booking Page
                                </Link>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => openEditModal(ev)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                        aria-label="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ev.id)}
                                        className="text-gray-400 hover:text-red-300 transition-colors"
                                        aria-label="Delete"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-neutral-950 border border-white/10 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                {formData.id ? 'Edit Event Type' : 'Add Event Type'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white text-2xl leading-none"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Event Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-md p-2 outline-none focus:border-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-md p-2 outline-none focus:border-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">URL Slug</label>
                                <div className="flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/10 bg-white/5 text-gray-400 sm:text-sm">
                                        /book/
                                    </span>
                                    <input
                                        required
                                        type="text"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        className="flex-1 min-w-0 block w-full bg-white/5 px-3 py-2 rounded-none rounded-r-md border border-white/10 outline-none focus:border-white"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-white/90"
                                >
                                    Save Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
