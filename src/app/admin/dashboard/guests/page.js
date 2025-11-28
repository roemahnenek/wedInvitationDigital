"use client";

import { useState, useEffect } from 'react';
import { Users, Check, X, MessageSquare, Calendar, Trash2 } from 'lucide-react';
import moment from 'moment';

export default function GuestsPage() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, attending, not-attending
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        try {
            const res = await fetch('/api/guests');
            if (!res.ok) throw new Error('Failed to fetch guests');
            const data = await res.json();
            setGuests(data);
        } catch (error) {
            console.error('Error fetching guests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this RSVP?')) return;
        
        try {
            const res = await fetch(`/api/guests/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete guest');
            setGuests(guests.filter(g => g._id !== id));
        } catch (error) {
            console.error('Error deleting guest:', error);
            alert('Failed to delete RSVP');
        }
    };

    const filteredGuests = guests.filter(guest => {
        const matchesFilter = 
            filter === 'all' ? true :
            filter === 'attending' ? guest.isAttending :
            !guest.isAttending;
        
        const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (guest.message && guest.message.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: guests.length,
        attending: guests.filter(g => g.isAttending).length,
        notAttending: guests.filter(g => !g.isAttending).length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                        <p className="text-gray-600">Loading guests data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                                <Users size={28} />
                                Guest RSVPs
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">Manage and view all guest responses</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total RSVPs</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Attending</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{stats.attending}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Check className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Not Attending</p>
                                <p className="text-3xl font-bold text-red-600 mt-1">{stats.notAttending}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <X className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by name or message..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-full font-medium transition ${
                                    filter === 'all' 
                                        ? 'bg-gray-900 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                All ({stats.total})
                            </button>
                            <button
                                onClick={() => setFilter('attending')}
                                className={`px-4 py-2 rounded-full font-medium transition ${
                                    filter === 'attending' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Attending ({stats.attending})
                            </button>
                            <button
                                onClick={() => setFilter('not-attending')}
                                className={`px-4 py-2 rounded-full font-medium transition ${
                                    filter === 'not-attending' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Not Attending ({stats.notAttending})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Guests List */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {filteredGuests.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500">No RSVPs found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Guest Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Invitation
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Submitted
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredGuests.map((guest) => (
                                        <tr key={guest._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                                        <span className="text-amber-600 font-semibold">
                                                            {guest.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-900">{guest.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {guest.invitationId ? (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {guest.invitationId.groom?.name} & {guest.invitationId.bride?.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">/{guest.invitationId.slug}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Unknown</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {guest.isAttending ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        <Check size={14} />
                                                        Attending
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                        <X size={14} />
                                                        Not Attending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {guest.message ? (
                                                    <div className="flex items-start gap-2 max-w-md">
                                                        <MessageSquare size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-gray-600 line-clamp-2">{guest.message}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">No message</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Calendar size={14} />
                                                    {moment(guest.createdAt).format('MMM DD, YYYY')}
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    {moment(guest.createdAt).format('HH:mm')}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleDelete(guest._id)}
                                                    className="text-red-600 hover:text-red-800 transition"
                                                    title="Delete RSVP"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
