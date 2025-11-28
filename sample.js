import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Calendar, MapPin, Gift, Heart, Copy, Check, ChevronDown, X } from 'lucide-react';

export default function ModernJavaneseWedding() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showInvitation, setShowInvitation] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [copiedBank, setCopiedBank] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [rsvpData, setRsvpData] = useState({
    attending: '',
    guests: '1',
    message: ''
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const audioRef = useRef(null);

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

  const handleRSVP = (e) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    setTimeout(() => setRsvpSubmitted(false), 3000);
  };

  const galleryImages = [
    { id: 1, caption: 'Casual moments' },
    { id: 2, caption: 'Traditional elegance' },
    { id: 3, caption: 'Formal portrait' },
    { id: 4, caption: 'Garden celebration' },
    { id: 5, caption: 'Together forever' },
    { id: 6, caption: 'Our love story' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Control */}
      {showInvitation && (
        <div className="fixed top-6 right-6 z-50 bg-white/95 backdrop-blur-md rounded-full p-3 shadow-xl">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-slate-800 hover:text-amber-700 transition">
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-amber-700"
            />
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      {showInvitation && (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
          {[
            { id: 'hero', label: 'Home', icon: '🏠' },
            { id: 'couple', label: 'Couple', icon: '💑' },
            { id: 'event', label: 'Event', icon: '📅' },
            { id: 'gallery', label: 'Gallery', icon: '📷' },
            { id: 'rsvp', label: 'RSVP', icon: '✉️' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group relative bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-amber-700 hover:text-white transition"
              title={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="absolute left-full ml-3 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {!showInvitation ? (
        /* Landing Page */
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
          {/* Batik Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 10L10 30l20 20 20-20-20-20z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          {/* Floating Florals */}
          <div className="absolute top-10 left-10 text-white/20 text-8xl animate-pulse">🌸</div>
          <div className="absolute bottom-20 right-10 text-white/20 text-8xl animate-pulse" style={{ animationDelay: '1s' }}>🌸</div>
          <div className="absolute top-1/3 right-20 text-white/10 text-6xl animate-pulse" style={{ animationDelay: '2s' }}>✦</div>

          <div className="relative min-h-screen flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
              {/* Decorative Border */}
              <div className="relative bg-white/10 backdrop-blur-md p-12 rounded-3xl border-2 border-white/30 shadow-2xl">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-700 px-8 py-2 rounded-full border-4 border-white/20">
                  <p className="text-white text-sm tracking-widest">THE WEDDING OF</p>
                </div>

                {/* Bismillah */}
                <div className="mb-8 mt-4">
                  <p className="text-white/90 text-2xl mb-2" style={{ fontFamily: "'Amiri', serif" }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
                </div>

                {/* Names */}
                <h1 className="text-7xl mb-3 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Jasmine
                </h1>
                <div className="flex items-center justify-center gap-4 my-4">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500"></div>
                  <Heart className="text-amber-500" size={24} fill="currentColor" />
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <h1 className="text-7xl mb-8 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Bayu
                </h1>

                <p className="text-white/80 text-lg mb-2">Saturday, November 12, 2026</p>
                <p className="text-white/60 text-sm mb-8 tracking-wider">12 . 11 . 26</p>

                {/* Guest Name Input */}
                <div className="mb-6">
                  <label className="block text-white/80 text-sm mb-3 tracking-wide">Dear Our Beloved</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full max-w-md mx-auto px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full text-white placeholder-white/50 text-center focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <button
                  onClick={openInvitation}
                  disabled={!guestName.trim()}
                  className="bg-amber-700 text-white px-10 py-4 rounded-full hover:bg-amber-600 transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                >
                  Open Invitation
                </button>

                <div className="mt-8">
                  <ChevronDown className="text-white/50 animate-bounce mx-auto" size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Invitation */
        <div className="relative">
          {/* Hero Section */}
          <section id="hero" className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 flex items-center">
            <div className="absolute inset-0 opacity-20">
              <div style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30 30 0zm0 10L10 30l20 20 20-20-20-20z' fill='%23ffffff'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
              <div className="max-w-4xl mx-auto">
                <p className="text-amber-500 tracking-widest text-sm mb-4">DEAR MR/MRS/MS</p>
                <h2 className="text-5xl md:text-6xl text-white mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {guestName}
                </h2>
                
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 mb-8">
                  <p className="text-white/90 text-lg leading-relaxed italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."
                  </p>
                  <p className="text-amber-500 text-sm mt-3">— Ar-Rum 30:21</p>
                </div>

                <p className="text-white/80 text-lg">
                  You are cordially invited to celebrate our wedding
                </p>
              </div>
            </div>
          </section>

          {/* Couple Section */}
          <section id="couple" className="py-20 bg-stone-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 relative">
              <div className="text-center mb-16">
                <p className="text-amber-700 tracking-widest text-sm mb-3">INTRODUCING</p>
                <h2 className="text-5xl text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  The Bride & Groom
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-700 to-emerald-700 mx-auto"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
                {/* Bride */}
                <div className="text-center group">
                  <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-amber-700/20 rounded-3xl rotate-6 group-hover:rotate-3 transition-transform"></div>
                    <div className="relative bg-white p-4 rounded-3xl shadow-2xl">
                      <div className="w-72 h-96 bg-gradient-to-br from-slate-200 to-amber-100 rounded-2xl flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <div className="text-6xl mb-2">👰🏻</div>
                          <p className="text-sm">Bride Photo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-4xl text-slate-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Fauziah Jasmine
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Putri Pertama dari<br />
                    <span className="font-semibold">Bapak (Alm) Yoyo Sucahyo</span><br />
                    &<br />
                    <span className="font-semibold">Ibu Lina Raeny</span>
                  </p>
                </div>

                {/* Groom */}
                <div className="text-center group">
                  <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-emerald-700/20 rounded-3xl -rotate-6 group-hover:-rotate-3 transition-transform"></div>
                    <div className="relative bg-white p-4 rounded-3xl shadow-2xl">
                      <div className="w-72 h-96 bg-gradient-to-br from-slate-200 to-emerald-100 rounded-2xl flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <div className="text-6xl mb-2">🤵🏻</div>
                          <p className="text-sm">Groom Photo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-4xl text-slate-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Bayu Tri Astanto
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Putra Ketiga dari<br />
                    <span className="font-semibold">Bapak (Alm) H. Mulyadi</span><br />
                    &<br />
                    <span className="font-semibold">Ibu Nonoy Suryati</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Event Details */}
          <section id="event" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900 relative">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <p className="text-amber-500 tracking-widest text-sm mb-3">SAVE THE DATE</p>
                <h2 className="text-5xl text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Wedding Events
                </h2>
                <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Akad Nikah */}
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:border-amber-500 transition">
                  <Calendar className="text-amber-500 mb-4" size={40} />
                  <h3 className="text-2xl text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Akad Nikah
                  </h3>
                  <div className="space-y-3 text-white/80">
                    <p className="text-lg">Saturday, November 12, 2026</p>
                    <p className="text-amber-500 font-semibold">10:00 WIB</p>
                    <div className="flex items-start gap-3 pt-3 border-t border-white/20">
                      <MapPin className="flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Kediaman Mempelai Wanita</p>
                        <p className="text-sm">Jl. Mayor Dasuki, Desa Penganjang Rt 07/Rw 03<br />Kec. Sindang, Kab. Indramayu</p>
                      </div>
                    </div>
                  </div>
                  <button className="mt-6 w-full bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-full transition">
                    View Map
                  </button>
                </div>

                {/* Resepsi */}
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:border-emerald-500 transition">
                  <Calendar className="text-emerald-500 mb-4" size={40} />
                  <h3 className="text-2xl text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Resepsi Pernikahan
                  </h3>
                  <div className="space-y-3 text-white/80">
                    <p className="text-lg">Saturday, November 12, 2026</p>
                    <p className="text-emerald-500 font-semibold">11:00 WIB - Selesai</p>
                    <div className="flex items-start gap-3 pt-3 border-t border-white/20">
                      <MapPin className="flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">Kediaman Mempelai Wanita</p>
                        <p className="text-sm">Jl. Mayor Dasuki, Desa Penganjang Rt 07/Rw 03<br />Kec. Sindang, Kab. Indramayu</p>
                      </div>
                    </div>
                  </div>
                  <button className="mt-6 w-full bg-emerald-700 hover:bg-emerald-600 text-white py-3 rounded-full transition">
                    View Map
                  </button>
                </div>
              </div>

              {/* Dress Code */}
              <div className="max-w-3xl mx-auto mt-12 bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
                <h4 className="text-2xl text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Dress Code
                </h4>
                <p className="text-white/80 mb-4">We kindly encourage our guests to wear</p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-900 rounded-full border-4 border-white/30 mx-auto mb-2"></div>
                    <p className="text-white text-sm">Black</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-700 rounded-full border-4 border-white/30 mx-auto mb-2"></div>
                    <p className="text-white text-sm">Dark Grey</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-900 rounded-full border-4 border-white/30 mx-auto mb-2"></div>
                    <p className="text-white text-sm">Gold Accent</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section id="gallery" className="py-20 bg-stone-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <p className="text-amber-700 tracking-widest text-sm mb-3">MEMORIES</p>
                <h2 className="text-5xl text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Our Journey
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-700 to-emerald-700 mx-auto"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-slate-200 to-amber-100 flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-sm">{img.caption}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white text-sm">{img.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Image Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6" onClick={() => setSelectedImage(null)}>
              <button className="absolute top-6 right-6 text-white hover:text-amber-500 transition">
                <X size={32} />
              </button>
              <div className="max-w-4xl w-full">
                <div className="bg-gradient-to-br from-slate-200 to-amber-100 rounded-2xl aspect-[4/5] flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-xl">{selectedImage.caption}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Love Story */}
          <section className="py-20 bg-gradient-to-b from-amber-50 to-emerald-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-5xl text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Our Love Story
                </h2>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber-300 -translate-x-1/2"></div>
                  
                  {[
                    { year: '2020', title: 'First Meeting', text: 'Our paths crossed for the first time' },
                    { year: '2022', title: 'Growing Together', text: 'Learning and growing in love' },
                    { year: '2024', title: 'The Proposal', text: 'He asked, she said yes!' },
                    { year: '2026', title: 'Forever Begins', text: 'Our wedding day' }
                  ].map((story, idx) => (
                    <div key={idx} className={`relative mb-12 ${idx % 2 === 0 ? 'md:pr-1/2 text-right' : 'md:pl-1/2 text-left'}`}>
                      <div className="inline-block bg-white p-6 rounded-2xl shadow-lg max-w-md">
                        <div className="absolute top-6 w-4 h-4 bg-amber-700 rounded-full" style={{
                          [idx % 2 === 0 ? 'right' : 'left']: '-2rem'
                        }}></div>
                        <p className="text-amber-700 font-semibold mb-2">{story.year}</p>
                        <h4 className="text-xl text-slate-800 font-semibold mb-1">{story.title}</h4>
                        <p className="text-slate-600 text-sm">{story.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <p className="text-amber-500 tracking-widest text-sm mb-3">PLEASE RESPOND</p>
                <h2 className="text-5xl text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  RSVP
                </h2>
                <p className="text-white/70">Kindly confirm your attendance by filling this form</p>
              </div>

              <form onSubmit={handleRSVP} className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
                <div className="space-y-6">
                  <div>
                    <label className="block text-white mb-2 text-sm">Will you attend?</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRsvpData({ ...rsvpData, attending: 'yes' })}
                        className={`py-3 rounded-full transition ${
                          rsvpData.attending === 'yes'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/20 text-white/70 hover:bg-white/30'
                        }`}
                      >
                        Yes, I'll be there
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpData({ ...rsvpData, attending: 'no' })}
                        className={`py-3 rounded-full transition ${
                          rsvpData.attending === 'no'
                            ? 'bg-red-600 text-white'
                            : 'bg-white/20 text-white/70 hover:bg-white/30'
                        }`}
                      >
                        Sorry, can't make it
                      </button>
                    </div>
                  </div>

                  {rsvpData.attending === 'yes' && (
                    <div>
                      <label className="block text-white mb-2 text-sm">Number of Guests</label>
                      <select
                        value={rsvpData.guests}
                        onChange={(e) => setRsvpData({ ...rsvpData, guests: e.target.value })}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-full text-white focus:outline-none focus:border-amber-500"
                      >
                        {[1,2,3,4,5].map(n => (
                          <option key={n} value={n} className="bg-slate-800">{n} Guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-white mb-2 text-sm">Message & Wishes</label>
                    <textarea
                      value={rsvpData.message}
                      onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                      rows="4"
                      placeholder="Share your wishes for the couple..."
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-amber-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={!rsvpData.attending}
                    className="w-full bg-amber-700 hover:bg-amber-600 text-white py-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Submit RSVP
                  </button>

                  {rsvpSubmitted && (
                    <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-100 p-4 rounded-2xl text-center">
                      ✓ Thank you for your response!
                    </div>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Gift Section */}
          <section id="gift" className="py-20 bg-stone-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <Gift className="w-16 h-16 text-amber-700 mx-auto mb-4" />
                <h2 className="text-5xl text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Wedding Gift
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Your presence is the greatest gift of all. However, if you wish to honor us with a gift, 
                  we would be grateful for a contribution to our future together.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Bank 1 */}
                <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-8 rounded-3xl shadow-xl text-white">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-amber-200 text-sm mb-1">BANK BCA</p>
                      <p className="text-xs text-amber-200/80">a.n. Fauziah Jasmine</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Gift size={24} />
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-4">
                    <p className="text-2xl font-mono tracking-wider mb-2">1234 5678 9012</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('123456789012', 'bca')}
                    className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-full transition flex items-center justify-center gap-2"
                  >
                    {copiedBank === 'bca' ? (
                      <>
                        <Check size={18} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copy Account Number</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bank 2 */}
                <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 rounded-3xl shadow-xl text-white">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-emerald-200 text-sm mb-1">BANK MANDIRI</p>
                      <p className="text-xs text-emerald-200/80">a.n. Bayu Tri Astanto</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Gift size={24} />
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mb-4">
                    <p className="text-2xl font-mono tracking-wider mb-2">9876 5432 1098</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard('987654321098', 'mandiri')}
                    className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-full transition flex items-center justify-center gap-2"
                  >
                    {copiedBank === 'mandiri' ? (
                      <>
                        <Check size={18} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copy Account Number</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Thank You / Closing */}
          <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 text-white/10 text-8xl">🌸</div>
            <div className="absolute bottom-10 right-10 text-white/10 text-8xl">🌸</div>

            <div className="container mx-auto px-6 text-center relative z-10">
              <div className="max-w-3xl mx-auto">
                <Heart className="w-16 h-16 text-amber-500 mx-auto mb-6" fill="currentColor" />
                
                <h2 className="text-5xl md:text-6xl text-white mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Thank You
                </h2>

                <p className="text-white/80 text-lg leading-relaxed mb-8">
                  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila 
                  Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
                </p>

                <div className="inline-block bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 mb-8">
                  <p className="text-white/70 text-sm mb-1">With Love,</p>
                  <p className="text-3xl text-white" style={{ fontFamily: "'Great Vibes', cursive" }}>
                    Jasmine & Bayu
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-amber-500 font-semibold tracking-wider">#JasmineBayuWedding</p>
                  <p className="text-white/50 text-sm">12 . 11 . 26</p>
                </div>

                {/* Credits */}
                <div className="mt-16 pt-8 border-t border-white/10">
                  <p className="text-white/40 text-xs">
                    Made with ❤️ for Jasmine & Bayu
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Navigation for Mobile */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 lg:hidden z-40">
            <div className="flex justify-around max-w-lg mx-auto">
              {[
                { id: 'hero', icon: '🏠' },
                { id: 'couple', icon: '💑' },
                { id: 'event', icon: '📅' },
                { id: 'gallery', icon: '📷' },
                { id: 'rsvp', icon: '✉️' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex flex-col items-center gap-1 text-slate-600 hover:text-amber-700 transition"
                >
                  <span className="text-xl">{item.icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Inter:wght@300;400;600&family=Amiri:wght@400;700&display=swap');
      `}</style>
    </div>
  );
}