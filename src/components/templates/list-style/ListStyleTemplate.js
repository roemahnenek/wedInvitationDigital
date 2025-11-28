"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Gift, Heart, Copy, Check, Music, Pause, Play, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Outfit, DM_Serif_Display } from 'next/font/google';
import moment from 'moment';

// Fonts
const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'] });

const defaultData = {
  bride: { name: "Bride Name", parents: "Parents of Bride" },
  groom: { name: "Groom Name", parents: "Parents of Groom" },
  weddingDate: new Date(),
  events: [],
  gallery: [],
  story: [],
  bankAccounts: [],
  audioUrl: '',
};

export default function ListStyleTemplate({ invitationData = defaultData, apiPath = '/api/guests' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [copiedBank, setCopiedBank] = useState('');
  const [rsvpData, setRsvpData] = useState({ name: '', attending: '', guests: 1, message: '' });
  const [rsvpStatus, setRsvpStatus] = useState({ submitting: false, submitted: false, error: '' });
  const audioRef = useRef(null);

  const { bride, groom, weddingDate, events, gallery, story, heroQuote, audioUrl, bankAccounts } = invitationData;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(e => console.log("Audio play failed", e));
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const openInvitation = () => {
    setShowContent(true);
    setIsPlaying(true);
    setRsvpData(prev => ({ ...prev, name: guestName }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text, bank) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(''), 2000);
  };

  const handleRSVP = async (e) => {
    e.preventDefault();
    setRsvpStatus({ submitting: true, submitted: false, error: '' });
    try {
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: rsvpData.name,
          message: rsvpData.message,
          isAttending: rsvpData.attending === 'yes',
          invitationId: invitationData._id,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit RSVP');
      setRsvpStatus({ submitting: false, submitted: true, error: '' });
    } catch (error) {
      setRsvpStatus({ submitting: false, submitted: false, error: error.message });
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const formattedDate = moment(weddingDate).format('dddd, DD MMMM YYYY');

  if (!showContent) {
    return (
      <div className={`min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center p-6 text-center ${outfit.className}`}>
        <div className="max-w-md w-full bg-white p-10 rounded-[32px] shadow-xl border border-stone-100">
            <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-xs tracking-[0.2em] uppercase rounded-full">The Wedding Of</span>
            </div>
            <h1 className={`text-4xl md:text-5xl text-stone-800 mb-4 leading-tight ${dmSerif.className}`}>
                {bride.name} <br/> <span className="text-stone-400 text-3xl">&</span> <br/> {groom.name}
            </h1>
            <div className="w-12 h-0.5 bg-stone-200 mx-auto my-6"></div>
            <p className="text-stone-500 mb-8">{formattedDate}</p>
            
            <div className="space-y-4">
                <p className="text-sm text-stone-400">Dear,</p>
                <input 
                    type="text" 
                    placeholder="Guest Name" 
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-3 text-center bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                />
                <button 
                    onClick={openInvitation}
                    className="w-full py-3.5 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                    Open Invitation
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F7F5F2] max-w-md mx-auto shadow-2xl min-w-0 ${outfit.className}`}>
      {audioUrl && (
        <audio ref={audioRef} loop>
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {/* Floating Music Button */}
      <button 
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-800 hover:bg-stone-50 transition-all"
      >
        {isPlaying ? <Pause size={20} /> : <Music size={20} />}
      </button>

      {/* Header */}
      <header className="bg-white p-8 rounded-b-[40px] shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-stone-200 via-stone-400 to-stone-200"></div>
        <h1 className={`text-3xl text-stone-800 mb-2 ${dmSerif.className}`}>
          {bride.name} & {groom.name}
        </h1>
        <p className="text-stone-500 text-sm">{formattedDate}</p>
      </header>

      {/* Quote */}
      <div className="px-6 py-8 text-center">
        <p className={`text-stone-600 italic leading-relaxed ${dmSerif.className} text-lg`}>
          "{heroQuote || "We found love in a hopeless place."}"
        </p>
      </div>

      {/* Menu List */}
      <div className="px-4 pb-24 space-y-3">
        
        {/* Couple Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
            <button 
                onClick={() => toggleSection('couple')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                        <Heart size={20} />
                    </div>
                    <span className="font-medium text-stone-800">The Couple</span>
                </div>
                {activeSection === 'couple' ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
            </button>
            {activeSection === 'couple' && (
                <div className="px-6 pb-6 pt-2 border-t border-stone-50">
                    <div className="space-y-6 text-center">
                        <div>
                            <div className="w-20 h-20 bg-stone-200 rounded-full mx-auto mb-3"></div>
                            <h3 className={`text-xl text-stone-800 ${dmSerif.className}`}>{bride.name}</h3>
                            <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-line">{bride.parents}</p>
                        </div>
                        <div className="text-stone-300">&</div>
                        <div>
                            <div className="w-20 h-20 bg-stone-200 rounded-full mx-auto mb-3"></div>
                            <h3 className={`text-xl text-stone-800 ${dmSerif.className}`}>{groom.name}</h3>
                            <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-line">{groom.parents}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
            <button 
                onClick={() => toggleSection('events')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                        <Calendar size={20} />
                    </div>
                    <span className="font-medium text-stone-800">Wedding Events</span>
                </div>
                {activeSection === 'events' ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
            </button>
            {activeSection === 'events' && (
                <div className="px-6 pb-6 pt-2 border-t border-stone-50 space-y-6">
                    {events.map((event, idx) => (
                        <div key={idx} className="relative pl-4 border-l-2 border-stone-200">
                            <h4 className={`text-lg text-stone-800 mb-1 ${dmSerif.className}`}>{event.title}</h4>
                            <p className="text-stone-500 text-sm mb-2">{event.date} • {event.time}</p>
                            <p className="text-stone-600 font-medium text-sm mb-1">{event.venueName}</p>
                            <p className="text-stone-500 text-xs mb-3">{event.venueAddress}</p>
                            {event.venueMapUrl && (
                                <a href={event.venueMapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-stone-800 border-b border-stone-800 pb-0.5 hover:opacity-70">
                                    View on Map <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Gallery Section */}
        {gallery.length > 0 && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                <button 
                    onClick={() => toggleSection('gallery')}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                            <Heart size={20} />
                        </div>
                        <span className="font-medium text-stone-800">Our Moments</span>
                    </div>
                    {activeSection === 'gallery' ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
                </button>
                {activeSection === 'gallery' && (
                    <div className="px-6 pb-6 pt-2 border-t border-stone-50">
                        <div className="grid grid-cols-2 gap-2">
                            {gallery.map((img, idx) => (
                                <div key={idx} className="aspect-square bg-stone-100 rounded-lg overflow-hidden">
                                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Gift Section */}
        {bankAccounts.length > 0 && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                <button 
                    onClick={() => toggleSection('gift')}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                            <Gift size={20} />
                        </div>
                        <span className="font-medium text-stone-800">Wedding Gift</span>
                    </div>
                    {activeSection === 'gift' ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
                </button>
                {activeSection === 'gift' && (
                    <div className="px-6 pb-6 pt-2 border-t border-stone-50 space-y-4">
                        {bankAccounts.map((acc, idx) => (
                            <div key={idx} className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                                <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">{acc.bankName}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-medium text-stone-800 font-mono">{acc.accountNumber}</p>
                                        <p className="text-xs text-stone-500">a.n {acc.accountHolder}</p>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(acc.accountNumber, acc.bankName)}
                                        className="p-2 bg-white rounded-lg shadow-sm text-stone-600 hover:text-stone-900"
                                    >
                                        {copiedBank === acc.bankName ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* RSVP Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">
            <button 
                onClick={() => toggleSection('rsvp')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-stone-50 transition"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                        <Check size={20} />
                    </div>
                    <span className="font-medium text-stone-800">RSVP</span>
                </div>
                {activeSection === 'rsvp' ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
            </button>
            {activeSection === 'rsvp' && (
                <div className="px-6 pb-6 pt-2 border-t border-stone-50">
                    <form onSubmit={handleRSVP} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Your Name" 
                            value={rsvpData.name}
                            onChange={(e) => setRsvpData({...rsvpData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm"
                            required
                        />
                        <select 
                            value={rsvpData.attending}
                            onChange={(e) => setRsvpData({...rsvpData, attending: e.target.value})}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm text-stone-600"
                            required
                        >
                            <option value="">Will you attend?</option>
                            <option value="yes">Yes, I will attend</option>
                            <option value="no">Sorry, I cannot attend</option>
                        </select>
                        <textarea 
                            placeholder="Message for the couple" 
                            value={rsvpData.message}
                            onChange={(e) => setRsvpData({...rsvpData, message: e.target.value})}
                            rows={3}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm resize-none"
                        ></textarea>
                        <button 
                            type="submit" 
                            disabled={rsvpStatus.submitting}
                            className="w-full py-3 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-700 transition disabled:opacity-50"
                        >
                            {rsvpStatus.submitting ? 'Sending...' : 'Send RSVP'}
                        </button>
                        {rsvpStatus.submitted && <p className="text-green-600 text-center text-sm">Thank you for your response!</p>}
                    </form>
                </div>
            )}
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center pb-8 pt-4">
        <p className={`text-2xl text-stone-300 ${dmSerif.className}`}>{bride.name} & {groom.name}</p>
      </footer>
    </div>
  );
}
