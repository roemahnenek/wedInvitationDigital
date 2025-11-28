"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Volume2,
  VolumeX,
  Calendar,
  MapPin,
  Gift,
  Heart,
  Copy,
  Check,
  ChevronDown,
  X,
  BookOpen,
} from "lucide-react";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Great_Vibes,
  Inter,
  EB_Garamond,
} from "next/font/google";
import moment from "moment";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "600"] });
const ebGaramond = EB_Garamond({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"] 
});

const defaultData = {
  bride: { name: "Bride" },
  groom: { name: "Groom" },
  weddingDate: new Date(),
  events: [],
  gallery: [],
  story: [],
  bankAccounts: [],
  coverImage: "",
  heroImage: "",
  coupleImage: "",
  storyImage: "",
  eventImage: "",
  rsvpImage: "",
  giftImage: "",
  footerImage: "",
  desktopImage: "",
  venueMapUrl: "",
};

export default function SundaTemplate({
  invitationData = defaultData,
  apiPath = "/api/guests",
}) {
  let searchParams;
  try {
    searchParams = useSearchParams();
  } catch (e) {
    // useSearchParams might not be available during SSR
    searchParams = null;
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showInvitation, setShowInvitation] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [copiedBank, setCopiedBank] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rsvpData, setRsvpData] = useState({
    name: "",
    attending: "",
    guests: 1,
    message: "",
  });
  const [rsvpStatus, setRsvpStatus] = useState({
    submitting: false,
    submitted: false,
    error: "",
  });

  const [guestMessages, setGuestMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const audioRef = useRef(null);

  useEffect(() => {
    if (invitationData._id) {
      fetchMessages();
    }
  }, [invitationData._id]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${apiPath}?invitationId=${invitationData._id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setGuestMessages(data.filter((g) => g.message)); // Only show guests with messages
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const {
    bride,
    groom,
    weddingDate,
    events,
    gallery,
    story,
    heroQuote,
    hashtag,
    audioUrl,
    bankAccounts,
    coverImage,
    heroImage,
    coupleImage,
    storyImage,
    eventImage,
    rsvpImage,
    giftImage,
    footerImage,
    desktopImage,
    venueMapUrl,
  } = invitationData;

  // Get guest name from URL query parameter
  useEffect(() => {
    if (searchParams) {
      const nameFromUrl = searchParams.get("name");
      if (nameFromUrl) {
        setGuestName(decodeURIComponent(nameFromUrl));
        // Don't auto-fill RSVP name - let user input freely
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  // Stop music when browser is closing or page is hidden
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
      }
    };

    const handlePageHide = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    // For desktop browsers
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // For mobile browsers (iOS Safari)
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Cleanup: stop audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Intersection Observer for image animations
  useEffect(() => {
    if (!showInvitation) return;

    // Add small delay to ensure images are in DOM
    const timer = setTimeout(() => {
      // Find the scroll container
      const scrollContainer = document.querySelector(
        ".w-full.lg\\:w-5\\/12.relative.h-screen.overflow-y-auto"
      );

      if (!scrollContainer) {
        console.log("Scroll container not found");
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log("Animating image:", entry.target); // Debug

              // Apply animation directly via inline style
              entry.target.style.transition =
                "opacity 1s ease-out, transform 1s ease-out";
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";

              observer.unobserve(entry.target); // Only animate once
            }
          });
        },
        {
          root: scrollContainer, // Use scroll container as root
          threshold: 0.1, // Trigger when 10% of image is visible
          rootMargin: "0px", // Trigger exactly when entering viewport
        }
      );

      // Observe all images with data-animate attribute
      const images = document.querySelectorAll('[data-animate="true"]');
      console.log("Found images to animate:", images.length); // Debug

      images.forEach((img, index) => {
        // Set initial state
        img.style.opacity = "0";
        img.style.transform = "translateY(40px)";

        observer.observe(img);

        // For first image (hero), trigger immediately since it's already visible
        if (index === 0) {
          setTimeout(() => {
            img.style.transition = "opacity 1s ease-out, transform 1s ease-out";
            img.style.opacity = "1";
            img.style.transform = "translateY(0)";
          }, 300);
        }
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [showInvitation]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const openInvitation = () => {
    setShowInvitation(true);
    setIsPlaying(true);
    
    // Manually trigger audio play on mobile (requires user interaction)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch((e) => {
          console.log("Audio autoplay prevented:", e);
          // If autoplay fails, the user can still use the volume control
        });
      }
    }, 100);
    
    // Set RSVP name from guestName if available
    if (guestName) {
      setRsvpData((prev) => ({ ...prev, name: guestName }));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(index);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRSVP = async (e) => {
    e.preventDefault();
    setRsvpStatus({ submitting: true, submitted: false, error: "" });

    try {
      const response = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpData.name,
          message: rsvpData.message,
          isAttending: rsvpData.attending === "yes",
          invitationId: invitationData._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit RSVP");
      }

      setRsvpStatus({ submitting: false, submitted: true, error: "" });
      fetchMessages(); // Refresh messages
      setRsvpData({ name: "", attending: "", guests: 1, message: "" }); // Reset form
      setTimeout(
        () => setRsvpStatus((prev) => ({ ...prev, submitted: false })),
        5000
      );
    } catch (error) {
      setRsvpStatus({
        submitting: false,
        submitted: false,
        error: error.message,
      });
      console.error("RSVP submission error:", error);
    }
  };

  const formattedWeddingDate = moment(weddingDate).format(
    "dddd, MMMM DD, YYYY"
  );
  const dateDots = moment(weddingDate).format("DD . MM . YY");

  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      {audioUrl && (
        <audio ref={audioRef} loop preload="auto" playsInline>
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {showInvitation && (
        <>
          <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md rounded-full p-3 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="text-slate-800 hover:text-emerald-700 transition"
              >
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-emerald-700"
              />
            </div>
          </div>
        </>
      )}

      {!showInvitation ? (
        <div
          className="min-h-screen relative overflow-hidden"
          style={{ backgroundColor: "#82403f" }}
        >
          {/* Background Image - Full Design with Elegant Fade In */}
          <div className="absolute inset-0 flex items-center justify-center pt-12 pb-32">
            <img
              src={coverImage}
              alt="Wedding Invitation"
              className="w-full h-full object-contain opacity-0 animate-[fadeIn_1.5s_ease-in-out_forwards]"
            />
            {/* Dark overlay at bottom for better readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          {/* Button Section - Positioned at bottom */}
          <div className="relative min-h-screen flex items-end justify-center p-6 pb-2">
            <div className="max-w-md w-full text-center">
              <div className="mb-6 text-white opacity-0 animate-[fadeIn_1s_ease-in-out_0.5s_forwards]">
                <p className="text-xs mb-1 font-medium opacity-80">Dear</p>
                <h3
                  className={`text-xl font-bold ${playfair.className} tracking-wide`}
                >
                  {guestName || "Honored Guest"}
                </h3>
              </div>

              <button
                onClick={openInvitation}
                className="group inline-flex items-center gap-2 bg-[#2c2424] text-white px-6 py-3 rounded-full hover:bg-[#1a1515] transition-all duration-300 shadow-xl text-sm font-medium hover:scale-105 transform border border-white/10 opacity-0 animate-[fadeIn_1s_ease-in-out_1s_forwards]"
              >
                <BookOpen
                  size={18}
                  className="group-hover:-rotate-12 transition-transform duration-300"
                />
                <span>Open Invitation</span>
              </button>

              <div className="mt-6 opacity-0 animate-[fadeIn_1s_ease-in-out_1.5s_forwards]">
                <ChevronDown
                  className="text-white animate-bounce mx-auto opacity-80"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Add keyframes for fade-in animation */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .fade-in-image {
              opacity: 0;
              transform: translateY(40px);
              transition: opacity 1s ease-out, transform 1s ease-out;
            }

            .fade-in-image.animate-in {
              opacity: 1;
              transform: translateY(0);
            }
          `,
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Desktop Left Side - Static Image */}
          <div className="hidden lg:block lg:w-7/12 h-screen sticky top-0 overflow-hidden relative">
            <img
              src={desktopImage || coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Heading Overlay */}
            <div className="absolute inset-0 flex flex-col items-start justify-center text-left px-12 z-10">
              <h2 className={`${ebGaramond.className} text-white text-xl md:text-2xl font-light mb-4 tracking-wide`}>
                The Wedding of
              </h2>
              <h2 className={`${greatVibes.className} text-white text-4xl md:text-6xl font-normal mb-8`}>
                {bride?.name} &amp; {groom?.name}
              </h2>
              <div className="mt-4">
                <h2 className={`${ebGaramond.className} text-white text-lg md:text-xl font-light tracking-wider uppercase`}>
                  Save The Date
                </h2>
                <h2 className={`${ebGaramond.className} text-white text-lg md:text-xl font-light mt-2`}>
                  {moment(weddingDate).format('dddd, DD MMMM YYYY')}
                </h2>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-5/12 relative h-screen overflow-y-auto scroll-smooth">
            <section
              id="hero"
              className="bg-[#F1E9D7] relative overflow-hidden min-h-screen"
            >
              <div className="w-full">
                <img
                  src={heroImage}
                  alt="Wedding Invitation"
                  className="w-full h-auto block fade-in-image"
                  data-animate="true"
                />
              </div>

              {/* Guest Name Overlay (optional, bisa dihapus kalau tidak perlu) */}
              <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto">
                  {/* Nama tamu bisa ditampilkan di sini kalau perlu */}
                </div>
              </div>
            </section>

            <section
              id="couple"
              className="bg-[#F1E9D7] relative overflow-hidden"
            >
              <div className="w-full">
                <img
                  src={coupleImage}
                  alt="Couple"
                  className="w-full h-auto block fade-in-image"
                  data-animate="true"
                />
              </div>
            </section>

            <section className="bg-white relative overflow-hidden">
              <div className="w-full">
                <img
                  src={storyImage}
                  alt="Wedding Detail"
                  className="w-full h-auto block fade-in-image"
                  data-animate="true"
                />
              </div>
            </section>

            <section id="event" className="bg-white relative overflow-hidden">
              <div className="w-full">
                <img
                  src={eventImage}
                  alt="Event"
                  className="w-full h-auto block fade-in-image"
                  data-animate="true"
                />
              </div>
            </section>

            <section id="rsvp" className="bg-white relative overflow-hidden">
              <div className="w-full">
                <img
                  src={rsvpImage}
                  alt="RSVP"
                  className="w-full h-auto block fade-in-image"
                  data-animate="true"
                />
              </div>
            </section>

            <section id="gift" className="bg-white relative overflow-hidden">
              <div className="w-full relative">
                <img
                  src={giftImage}
                  alt="Gift"
                  className="w-full h-auto block fade-in-image"
                  data-animate="true"
                />
                {venueMapUrl && (
                  <div className="absolute bottom-[calc(23%+5px)] left-0 right-0 flex justify-center z-20">
                    <a
                      href={venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#82403f] text-white px-8 py-3 lg:px-12 lg:py-4 rounded-full shadow-xl hover:bg-[#1a1515] transition flex items-center gap-2 font-medium text-base lg:text-m border border-gray-200 hover:scale-105 transform duration-300"
                    >
                      <MapPin size={20} className="lg:w-6 lg:h-6" />
                      Google Maps link
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Story Section */}
            <section
              id="story"
              className="bg-gradient-to-b from-[#F1E9D7] to-white py-4 md:py-16 px-2 md:px-6"
            >
              <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-4 md:mb-12">
                  <h2
                    className={`text-lg md:text-4xl lg:text-5xl font-bold text-[#82403f] mb-1 md:mb-3 ${playfair.className}`}
                  >
                    Our Story
                  </h2>
                  <div className="w-10 md:w-24 h-0.5 md:h-1 bg-[#82403f] mx-auto mb-1 md:mb-4"></div>
                  <p className="text-[#82403f]/70 italic text-[10px] md:text-sm">
                    Our love journey
                  </p>
                </div>

                {story && story.length > 0 ? (
                  <div className="space-y-3 md:space-y-12">
                    {story.map((item, index) => (
                      <div
                        key={index}
                        className={`flex flex-col md:flex-row gap-2 md:gap-6 items-start ${
                          index % 2 === 1 ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        {/* Year Badge */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className="w-10 h-10 md:w-20 md:h-20 bg-[#82403f] rounded-full flex items-center justify-center shadow-lg">
                              <span
                                className={`text-white font-bold text-xs md:text-lg ${playfair.className}`}
                              >
                                {item.year}
                              </span>
                            </div>
                            {index < story.length - 1 && (
                              <div className="hidden md:block absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-[#82403f]/30"></div>
                            )}
                          </div>
                        </div>

                        {/* Story Content */}
                        <div className="flex-1 bg-white rounded-md md:rounded-2xl p-2.5 md:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                          <h3
                            className={`text-sm md:text-2xl font-bold text-[#2c2424] mb-1 md:mb-3 ${playfair.className}`}
                          >
                            {item.title}
                          </h3>
                          <p className="text-[11px] md:text-base text-[#2c2424]/80 leading-snug md:leading-relaxed">
                            {item.text}
                          </p>

                          {/* Decorative element */}
                          <div className="mt-1.5 md:mt-4 flex items-center gap-1 md:gap-2">
                            <Heart
                              size={10}
                              className="text-[#82403f] fill-[#82403f] md:w-4 md:h-4"
                            />
                            <div className="flex-1 h-px bg-gradient-to-r from-[#82403f]/50 to-transparent"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-12">
                    <p className="text-[#2c2424]/60 italic text-xs md:text-base">
                      Our love story will be here soon...
                    </p>
                  </div>
                )}

                {/* Bottom Decoration */}
                <div className="mt-4 md:mt-16 text-center">
                  <div className="inline-flex items-center gap-1.5 md:gap-3">
                    <div className="w-4 md:w-12 h-px bg-[#82403f]/30"></div>
                    <Heart
                      size={12}
                      className="text-[#82403f] fill-[#82403f] animate-pulse md:w-5 md:h-5"
                    />
                    <div className="w-4 md:w-12 h-px bg-emerald-700/30"></div>
                  </div>
                </div>
              </div>
            </section>

            <section id="gallery" className="bg-[#F1E9D7] py-8 md:py-12 px-4 md:px-6">
              <div className="container mx-auto">
                <div className="text-center mb-6 md:mb-10">
                  <h2
                    className={`text-2xl md:text-4xl font-bold text-[#2c2424] mb-2 md:mb-4 ${playfair.className}`}
                  >
                    Our Gallery
                  </h2>
                  <p className="text-[#2c2424]/80 italic font-serif text-xs md:text-base">
                    Our happy moments
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                  {gallery && gallery.length > 0 ? (
                    gallery.map((item, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-xl cursor-pointer hover:shadow-xl transition-all duration-300 group"
                        onClick={() => setSelectedImage(item.url)}
                      >
                        <img
                          src={item.url}
                          alt={item.caption || "Gallery"}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white text-sm font-medium tracking-wider">
                            VIEW
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500 italic">
                      No photos in gallery yet.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Bank Accounts Section */}
            {bankAccounts && bankAccounts.length > 0 && (
              <section className="py-4 md:py-12 bg-[#F9F8F4]">
                <div className="container mx-auto px-2 md:px-6">
                  <div className="text-center mb-4 md:mb-8">
                    <h3
                      className={`text-lg md:text-2xl text-slate-800 mb-1 ${playfair.className}`}
                    >
                      Wedding Gift
                    </h3>
                    <p className="text-slate-500 text-[10px] md:text-sm">
                      For those who wish to send a gift, please send via:
                    </p>
                  </div>
                  <div className="max-w-xl mx-auto space-y-2 md:space-y-4">
                    {bankAccounts.map((bank, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2.5 md:p-6 rounded-md md:rounded-2xl border border-stone-200 shadow-sm bg-white"
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-slate-800 text-xs md:text-lg">
                            {bank.bankName}
                          </span>
                          <span className="text-slate-600 font-mono text-sm md:text-xl tracking-wide my-0.5 md:my-1">
                            {bank.accountNumber}
                          </span>
                          <span className="text-slate-500 text-[10px] md:text-sm">
                            a.n {bank.accountHolder}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(bank.accountNumber, index)
                          }
                          className="p-1.5 md:p-3 bg-stone-50 rounded-md md:rounded-xl shadow-sm border border-stone-100 text-emerald-700 hover:bg-emerald-50 transition-colors group"
                          title="Copy Account Number"
                        >
                          {copiedBank === index ? (
                            <Check size={16} className="md:w-5 md:h-5" />
                          ) : (
                            <Copy
                              size={16}
                              className="group-hover:scale-110 transition-transform md:w-5 md:h-5"
                            />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section id="wishes" className="py-12 md:py-20 bg-[#F9F8F4]">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-8 md:mb-12">
                  <h2
                    className={`text-2xl md:text-4xl text-slate-800 mb-2 md:mb-4 ${playfair.className}`}
                  >
                    Wishes & Prayers
                  </h2>
                  <div className="w-16 md:w-24 h-1 bg-emerald-700 mx-auto"></div>
                </div>

                {/* Form */}
                <div className="max-w-2xl mx-auto mb-10 md:mb-16">
                  <form
                    onSubmit={handleRSVP}
                    className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-stone-100"
                  >
                    <div className="space-y-3 md:space-y-4">
                      <input
                        type="text"
                        value={rsvpData.name}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, name: e.target.value })
                        }
                        placeholder="Your Name"
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-[#F9F8F4] border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 placeholder-slate-400 text-sm md:text-base"
                        required
                      />
                      <textarea
                        value={rsvpData.message}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, message: e.target.value })
                        }
                        rows="3"
                        placeholder="Write your wishes & prayers..."
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-[#F9F8F4] border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none text-slate-800 placeholder-slate-400 text-sm md:text-base"
                        required
                      ></textarea>
                      <div className="flex gap-3 md:gap-4">
                        <select
                          value={rsvpData.attending}
                          onChange={(e) =>
                            setRsvpData({
                              ...rsvpData,
                              attending: e.target.value,
                            })
                          }
                          className="px-3 md:px-4 py-2 md:py-3 bg-[#F9F8F4] border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs md:text-sm text-slate-800"
                          required
                        >
                          <option value="">Confirm Attendance</option>
                          <option value="yes">Attending</option>
                          <option value="no">Not Attending</option>
                        </select>
                        <button
                          type="submit"
                          disabled={rsvpStatus.submitting}
                          className="flex-1 bg-[#82403f] hover:bg-[#6d3535] text-white py-2 md:py-3 rounded-xl transition disabled:opacity-50 font-medium text-sm md:text-base"
                        >
                          {rsvpStatus.submitting ? "Sending..." : "Send Wishes"}
                        </button>
                      </div>
                    </div>
                    {rsvpStatus.submitted && (
                      <p className="text-emerald-600 text-center mt-3 md:mt-4 text-xs md:text-sm">
                        Thank you for your wishes!
                      </p>
                    )}
                  </form>
                </div>

                {/* Messages List */}
                <div className="max-w-2xl mx-auto space-y-3 md:space-y-4">
                  {guestMessages.length === 0 ? (
                    <p className="text-center text-slate-500 italic">
                      No wishes yet. Be the first to send your wishes!
                    </p>
                  ) : (
                    <>
                      {guestMessages
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((guest, i) => (
                          <div
                            key={i}
                            className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-stone-100"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-bold text-slate-800 text-sm md:text-base">
                                {guest.name}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  guest.isAttending
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {guest.isAttending
                                  ? "Attending"
                                  : "Not Attending"}
                              </span>
                            </div>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                              {guest.message}
                            </p>
                            <p className="text-slate-400 text-xs mt-2 md:mt-3">
                              {moment(guest.createdAt).fromNow()}
                            </p>
                          </div>
                        ))}

                      {/* Pagination Controls */}
                      {guestMessages.length > itemsPerPage && (
                        <div className="flex justify-center gap-3 md:gap-4 mt-4 md:mt-6">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="px-3 md:px-4 py-2 bg-white border border-stone-200 rounded-full text-slate-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs md:text-sm"
                          >
                            ← Previous
                          </button>
                          <span className="text-slate-500 text-xs md:text-sm flex items-center">
                            Page {currentPage} of{" "}
                            {Math.ceil(guestMessages.length / itemsPerPage)}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(guestMessages.length / itemsPerPage)
                                )
                              )
                            }
                            disabled={
                              currentPage ===
                              Math.ceil(guestMessages.length / itemsPerPage)
                            }
                            className="px-3 md:px-4 py-2 bg-white border border-stone-200 rounded-full text-slate-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs md:text-sm"
                          >
                            Next →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="py-20 bg-white text-center">
              <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                  <h2
                    className={`text-4xl text-slate-800 mb-6 ${playfair.className}`}
                  >
                    Thank You
                  </h2>
                  <p className="text-slate-600 mb-12 leading-relaxed">
                    It would be an honor and happiness for us if you could
                    attend and give your blessings to us.
                  </p>
                  <p
                    className={`text-5xl text-slate-800 mb-4 ${greatVibes.className}`}
                  >
                    {bride.name} & {groom.name}
                  </p>
                  <div className="mt-16 pt-8 border-t border-slate-100">
                    <p className="text-slate-400 text-sm">
                      Created with ❤️ by Roemah Nenek Production
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-emerald-500 transition"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}
