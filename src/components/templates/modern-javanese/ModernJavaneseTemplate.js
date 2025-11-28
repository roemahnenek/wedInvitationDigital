"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Calendar, MapPin, Gift, Heart, Copy, Check, ChevronDown, X } from 'lucide-react';
import { Playfair_Display, Cormorant_Garamond, Great_Vibes, Inter, Amiri } from 'next/font/google';
import moment from 'moment';

// Setup Fonts
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'] });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'] });
const greatVibes = Great_Vibes({ subsets: ['latin'], weight: ['400'] });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '600'] });
const amiri = Amiri({ subsets: ['latin'], weight: ['400', '700'] });

// Default empty data to prevent errors if data is not loaded yet
const defaultData = {
  bride: { name: "Bride" },
  groom: { name: "Groom" },
  weddingDate: new Date(),
  events: [],
  gallery: [],
  story: [],
  bankAccounts: [],
};

export default function ModernJavaneseTemplate({ invitationData = defaultData, apiPath = '/api/guests' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showInvitation, setShowInvitation] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [copiedBank, setCopiedBank] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [rsvpData, setRsvpData] = useState({
    name: '',
    attending: '',
    guests: 1,
    message: ''
  });
  const [rsvpStatus, setRsvpStatus] = useState({ submitting: false, submitted: false, error: '' });
  const audioRef = useRef(null);
  
  const { bride, groom, weddingDate, events, gallery, story, heroQuote, hashtag, audioUrl, bankAccounts } = invitationData;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const openInvitation = () => {
    if (guestName.trim()) {
      setShowInvitation(true);
      setIsPlaying(true);
      setRsvpData(prev => ({ ...prev, name: guestName.trim() }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text, bank) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(''), 2000);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit RSVP');
        }

        setRsvpStatus({ submitting: false, submitted: true, error: '' });
        setTimeout(() => setRsvpStatus(prev => ({...prev, submitted: false})), 5000);

    } catch (error) {
        setRsvpStatus({ submitting: false, submitted: false, error: error.message });
        console.error('RSVP submission error:', error);
    }
  };
  
  const formattedWeddingDate = moment(weddingDate).format('dddd, MMMM DD, YYYY');
  const dateDots = moment(weddingDate).format('DD . MM . YY');

  return (
    <div className={`min-h-screen bg-stone-50 ${inter.className}`}>
      {audioUrl && (
        <audio ref={audioRef} loop>
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {showInvitation && (
        <>
          {/* Music Control */}
          <div className="fixed top-6 right-6 z-50 bg-white/95 backdrop-blur-md rounded-full p-3 shadow-xl">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-slate-800 hover:text-amber-700 transition">
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <input
                type="range" min="0" max="1" step="0.1" value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-amber-700"
              />
            </div>
          </div>
          {/* Quick Navigation */}
          <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
            {[ 
              { id: 'hero', label: 'Home', icon: '🏠' }, { id: 'couple', label: 'Couple', icon: '💑' },
              { id: 'event', label: 'Event', icon: '📅' }, { id: 'gallery', label: 'Gallery', icon: '📷' },
              { id: 'rsvp', label: 'RSVP', icon: '✉️' }
            ].map(item => (
              <button key={item.id} onClick={() => scrollToSection(item.id)}
                className="group relative bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-amber-700 hover:text-white transition"
                title={item.label}>
                <span className="text-lg">{item.icon}</span>
                <span className="absolute left-full ml-3 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {!showInvitation ? (
        /* Landing Page */
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 10L10 30l20 20 20-20-20-20z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`, backgroundSize: '30px 30px' }} />
          <div className="absolute top-10 left-10 text-white/20 text-8xl animate-pulse">🌸</div>
          <div className="absolute bottom-20 right-10 text-white/20 text-8xl animate-pulse" style={{ animationDelay: '1s' }}>🌸</div>
          <div className="absolute top-1/3 right-20 text-white/10 text-6xl animate-pulse" style={{ animationDelay: '2s' }}>✦</div>

          <div className="relative min-h-screen flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
              <div className="relative bg-white/10 backdrop-blur-md p-12 rounded-3xl border-2 border-white/30 shadow-2xl">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-700 px-8 py-2 rounded-full border-4 border-white/20">
                  <p className="text-white text-sm tracking-widest">THE WEDDING OF</p>
                </div>
                <div className={`mb-8 mt-4 ${amiri.className}`}>
                  <p className="text-white/90 text-2xl mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
                </div>
                <h1 className={`text-7xl mb-3 text-white ${playfair.className}`}>{bride.name}</h1>
                <div className="flex items-center justify-center gap-4 my-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500"></div>
                  <Heart className="text-amber-500" size={24} fill="currentColor" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <h1 className={`text-7xl mb-8 text-white ${playfair.className}`}>{groom.name}</h1>
                <p className="text-white/80 text-lg mb-2">{formattedWeddingDate}</p>
                <p className="text-white/60 text-sm mb-8 tracking-wider">{dateDots}</p>
                <div className="mb-6">
                  <label className="block text-white/80 text-sm mb-3 tracking-wide">Dear Our Beloved</label>
                  <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Enter your name"
                    className="w-full max-w-md mx-auto px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full text-white placeholder-white/50 text-center focus:outline-none focus:border-amber-500 transition" />
                </div>
                <button onClick={openInvitation} disabled={!guestName.trim()}
                  className="bg-amber-700 text-white px-10 py-4 rounded-full hover:bg-amber-600 transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium">
                  Open Invitation
                </button>
                <div className="mt-8"><ChevronDown className="text-white/50 animate-bounce mx-auto" size={28} /></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <section id="hero" className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 flex items-center">
            {/* ... hero content ... */}
             <div className="container mx-auto px-6 relative z-10 text-center">
              <div className="max-w-4xl mx-auto">
                <p className="text-amber-500 tracking-widest text-sm mb-4">DEAR MR/MRS/MS</p>
                <h2 className={`text-5xl md:text-6xl text-white mb-8 ${playfair.className}`}>{guestName}</h2>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 mb-8">
                  <p className={`text-white/90 text-lg leading-relaxed italic ${cormorant.className}`}>{heroQuote || '"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."'}</p>
                  <p className="text-amber-500 text-sm mt-3">— Ar-Rum 30:21</p>
                </div>
                <p className="text-white/80 text-lg">You are cordially invited to celebrate our wedding</p>
              </div>
            </div>
          </section>

          <section id="couple" className="py-20 bg-stone-50 relative overflow-hidden">
             {/* ... couple section ... */}
             <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
                {/* Bride */}
                <div className="text-center group">
                    <div className="relative mb-6 inline-block">
                    {/* ... photo placeholder ... */}
                    </div>
                    <h3 className={`text-4xl text-slate-800 mb-3 ${playfair.className}`}>{bride.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: bride.parents?.replace(/\n/g, '<br />') }} />
                </div>
                {/* Groom */}
                <div className="text-center group">
                    <div className="relative mb-6 inline-block">
                    {/* ... photo placeholder ... */}
                    </div>
                    <h3 className={`text-4xl text-slate-800 mb-3 ${playfair.className}`}>{groom.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: groom.parents?.replace(/\n/g, '<br />') }} />
                </div>
             </div>
          </section>

          <section id="event" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900 relative">
             {/* ... event section ... */}
             <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {events.map((event, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:border-amber-500 transition">
                        <Calendar className="text-amber-500 mb-4" size={40} />
                        <h3 className={`text-2xl text-white mb-4 ${playfair.className}`}>{event.title}</h3>
                        <div className="space-y-3 text-white/80">
                            <p className="text-lg">{event.date}</p>
                            <p className="text-amber-500 font-semibold">{event.time}</p>
                            <div className="flex items-start gap-3 pt-3 border-t border-white/20">
                            <MapPin className="flex-shrink-0 mt-1" size={20} />
                            <div>
                                <p className="text-sm font-semibold text-white mb-1">{event.venueName}</p>
                                <p className="text-sm">{event.venueAddress}</p>
                            </div>
                            </div>
                        </div>
                        <a href={event.venueMapUrl || '#'} target="_blank" rel="noopener noreferrer" className="mt-6 block w-full bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-full transition text-center">
                            View Map
                        </a>
                    </div>
                ))}
            </div>
          </section>

          <section id="gallery" className="py-20 bg-stone-50">
            {/* ... gallery ... */}
          </section>
          
          <section id="rsvp" className="py-20 bg-slate-800">
            {/* ... rsvp form ... */}
             <form onSubmit={handleRSVP} className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                <div className="space-y-6">
                  {/* ... name is pre-filled from landing page ... */}
                  <div>
                    <label className="block text-white mb-2 text-sm">Will you attend?</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => setRsvpData({ ...rsvpData, attending: 'yes' })}
                        className={`py-3 rounded-full transition ${ rsvpData.attending === 'yes' ? 'bg-emerald-600 text-white' : 'bg-white/20 text-white/70 hover:bg-white/30'}`}>
                        Yes, I'll be there
                      </button>
                      <button type="button" onClick={() => setRsvpData({ ...rsvpData, attending: 'no' })}
                        className={`py-3 rounded-full transition ${ rsvpData.attending === 'no' ? 'bg-red-600 text-white' : 'bg-white/20 text-white/70 hover:bg-white/30'}`}>
                        Sorry, can't make it
                      </button>
                    </div>
                  </div>

                  {rsvpData.attending === 'yes' && (
                    <div>
                      <label className="block text-white mb-2 text-sm">Number of Guests</label>
                      <select value={rsvpData.guests} onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-full text-white focus:outline-none focus:border-amber-500">
                        {[1,2,3,4,5].map(n => (<option key={n} value={n} className="bg-slate-800">{n} Guest{n > 1 ? 's' : ''}</option>))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-white mb-2 text-sm">Message & Wishes</label>
                    <textarea value={rsvpData.message} onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                      rows="4" placeholder="Share your wishes for the couple..."
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-amber-500 resize-none"></textarea>
                  </div>

                  <button type="submit" disabled={!rsvpData.attending || rsvpStatus.submitting}
                    className="w-full bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                    {rsvpStatus.submitting ? 'Submitting...' : 'Submit RSVP'}
                  </button>

                  {rsvpStatus.submitted && ( <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-100 p-4 rounded-2xl text-center">✓ Thank you for your response!</div> )}
                  {rsvpStatus.error && ( <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-2xl text-center">{ rsvpStatus.error}</div> )}
                </div>
              </form>
          </section>

          <section id="gift" className="py-20 bg-stone-50">
            {/* ... gift section ... */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {bankAccounts.map((account, i) => (
                    <div key={i} className="bg-gradient-to-br from-amber-700 to-amber-900 p-8 rounded-3xl shadow-xl text-white">
                        <p className="text-amber-200 text-sm mb-1">{account.bankName}</p>
                        <p className="text-xs text-amber-200/80">a.n. {account.accountHolder}</p>
                        <p className="text-2xl font-mono tracking-wider mb-2">{account.accountNumber}</p>
                        <button onClick={() => copyToClipboard(account.accountNumber, account.bankName)}
                            className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-full transition flex items-center justify-center gap-2">
                            {copiedBank === account.bankName ? ( <><Check size={18} /><span>Copied!</span></> ) : ( <><Copy size={18} /><span>Copy Account Number</span></> )}
                        </button>
                    </div>
                ))}
            </div>
          </section>

          <footer className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
            {/* ... footer ... */}
            <p className={`text-3xl text-white ${greatVibes.className}`}>{bride.name} & {groom.name}</p>
          </footer>

          {/* Bottom Navigation for Mobile */}
          {/* ... */}
        </div>
      )}
    </div>
  );
}
