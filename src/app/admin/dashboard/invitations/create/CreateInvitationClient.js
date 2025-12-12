"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Copy, Check } from "lucide-react";
import X from "lucide-react/dist/esm/icons/x";
import Link from "next/link";
import moment from "moment";

const templates = [
  { id: "modern-javanese", name: "Modern Javanese Wedding" },
  { id: "list-style", name: "Simple List Style" },
  { id: "sunda", name: "Sunda Wedding" },
  // Add other templates here
];

export default function CreateInvitationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateFromUrl = searchParams.get("template");
  const [urlOrigin, setUrlOrigin] = useState("");

  useEffect(() => {
    setUrlOrigin(window.location.origin);
  }, []);

  const [formData, setFormData] = useState({
    slug: "",
    templateId: templateFromUrl || "modern-javanese",
    groom: { name: "", parents: "", photoUrl: "" },
    bride: { name: "", parents: "", photoUrl: "" },
    weddingDate: "",
    events: [
      {
        title: "Akad Nikah",
        date: "",
        time: "",
        venueName: "",
        venueAddress: "",
        venueMapUrl: "",
      },
    ],
    gallery: [{ url: "", caption: "" }],
    story: [{ year: "", title: "", text: "" }],
    audioUrl: "",
    coverImage: "",
    heroQuote: "",
    hashtag: "",

    // Section Images
    heroImage: "",
    coupleImage: "",
    storyImage: "",
    eventImage: "",
    rsvpImage: "",
    giftImage: "",
    footerImage: "",
    desktopImage: "",
    venueMapUrl: "",

    showGiftSection: true,
    giftMessage: "",
    bankAccounts: [{ bankName: "", accountHolder: "", accountNumber: "" }],
    metaDescription: "", // Custom meta description for link preview
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("groom.")) {
      setFormData((prev) => ({
        ...prev,
        groom: { ...prev.groom, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("bride.")) {
      setFormData((prev) => ({
        ...prev,
        bride: { ...prev.bride, [name.split(".")[1]]: value },
      }));
    } else if (name === "slug") {
      setFormData((prev) => ({ ...prev, [name]: slugify(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    setFormData((prev) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addToArray = (arrayName, defaultObject) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultObject],
    }));
  };

  const removeFromArray = (index, arrayName) => {
    setFormData((prev) => {
      const newArray = prev[arrayName].filter((_, i) => i !== index);
      return { ...prev, [arrayName]: newArray };
    });
  };

  const copyInvitationUrl = () => {
    const fullUrl = `${urlOrigin}/v/${formData.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = { ...formData };

      // Filter out empty gallery items
      payload.gallery = payload.gallery.filter(item => item.url && item.url.trim() !== '');
      
      // Filter out empty story items
      payload.story = payload.story.filter(item => 
        item.year && item.year.trim() !== '' && 
        item.title && item.title.trim() !== '' && 
        item.text && item.text.trim() !== ''
      );
      
      // Filter out empty bank accounts
      payload.bankAccounts = payload.bankAccounts.filter(item => 
        item.bankName && item.bankName.trim() !== '' && 
        item.accountHolder && item.accountHolder.trim() !== '' && 
        item.accountNumber && item.accountNumber.trim() !== ''
      );

      if (payload.templateId === "sunda") {
        payload.events = [];
        payload.groom = { ...payload.groom, parents: "", photoUrl: "" };
        payload.bride = { ...payload.bride, parents: "", photoUrl: "" };
        payload.heroQuote = "";
        payload.hashtag = "";
        payload.dressCodeInfo = "";
        payload.giftMessage = "";
        if (!payload.weddingDate) delete payload.weddingDate;
      } else {
        // Filter out empty events
        payload.events = payload.events.filter(event => 
          event.title && event.title.trim() !== '' &&
          event.venueName && event.venueName.trim() !== ''
        );
        if (!payload.weddingDate) delete payload.weddingDate;
      }

      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create invitation");
      }

      setSuccess("Invitation created successfully!");
      router.push("/admin/dashboard/invitations");
    } catch (err) {
      setError(err.message);
      console.error("Error creating invitation:", err);
    } finally {
      setLoading(false);
    }
  };

  const isSunda = formData.templateId === "sunda";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard/invitations"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <ChevronLeft size={24} />
            </Link>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Invitation
            </h2>
          </div>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-2xl relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-900">
              Basic Information
            </legend>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-900"
                >
                  Invitation URL Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  placeholder="jasmine-and-bayu"
                />
                <p className="mt-1 text-xs text-gray-600">
                  Only letters, numbers, and dashes. No spaces allowed.
                </p>
                {formData.slug && urlOrigin && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="flex-1 text-xs text-emerald-700 font-medium break-all">
                      {urlOrigin}/v/{formData.slug}
                    </p>
                    <button
                      type="button"
                      onClick={copyInvitationUrl}
                      className="flex-shrink-0 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                      title="Copy URL"
                    >
                      {copiedUrl ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="templateId"
                  className="block text-sm font-medium text-gray-900"
                >
                  Template
                </label>
                <select
                  id="templateId"
                  name="templateId"
                  value={formData.templateId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="metaDescription"
                  className="block text-sm font-medium text-gray-900"
                >
                  Link Preview Description (for WhatsApp, Facebook, etc.)
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows="2"
                  className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  placeholder="You are invited to celebrate the wedding of..."
                />
                <p className="mt-1 text-xs text-gray-600">
                  This text will appear when sharing the invitation link on social media. Leave empty to use default.
                </p>
              </div>
            </div>
          </fieldset>

          {/* Groom Info */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-900">
              Groom Information
            </legend>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="groom.name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="groom.name"
                  name="groom.name"
                  value={formData.groom.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                />
              </div>
              {!isSunda && (
                <>
                  <div>
                    <label
                      htmlFor="groom.photoUrl"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Photo URL
                    </label>
                    <input
                      type="url"
                      id="groom.photoUrl"
                      name="groom.photoUrl"
                      value={formData.groom.photoUrl}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="groom.parents"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Parents (use `\n` for new line)
                    </label>
                    <textarea
                      id="groom.parents"
                      name="groom.parents"
                      value={formData.groom.parents}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                    ></textarea>
                  </div>
                </>
              )}
            </div>
          </fieldset>

          {/* Bride Info */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-900">
              Bride Information
            </legend>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="bride.name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="bride.name"
                  name="bride.name"
                  value={formData.bride.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                />
              </div>
              {!isSunda && (
                <>
                  <div>
                    <label
                      htmlFor="bride.photoUrl"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Photo URL
                    </label>
                    <input
                      type="url"
                      id="bride.photoUrl"
                      name="bride.photoUrl"
                      value={formData.bride.photoUrl}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="bride.parents"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Parents (use `\n` for new line)
                    </label>
                    <textarea
                      id="bride.parents"
                      name="bride.parents"
                      value={formData.bride.parents}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                    ></textarea>
                  </div>
                </>
              )}
            </div>
          </fieldset>

          {/* Wedding Date */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-900">
              Wedding Date
            </legend>
            <div className="mt-4">
              <div>
                <label
                  htmlFor="weddingDate"
                  className="block text-sm font-medium text-gray-900"
                >
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="weddingDate"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </fieldset>

          {/* Section Images for Sunda Template */}
          {isSunda && (
            <fieldset className="border p-4 rounded-lg">
              <legend className="text-lg font-medium text-gray-900">
                Section Images
              </legend>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="coverImage" className="block text-sm font-medium text-gray-900">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="desktopImage" className="block text-sm font-medium text-gray-900">
                    Desktop Image URL
                  </label>
                  <input
                    type="url"
                    id="desktopImage"
                    name="desktopImage"
                    value={formData.desktopImage}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="heroImage" className="block text-sm font-medium text-gray-900">
                    Hero Image URL
                  </label>
                  <input
                    type="url"
                    id="heroImage"
                    name="heroImage"
                    value={formData.heroImage}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="coupleImage" className="block text-sm font-medium text-gray-900">
                    Couple Image URL
                  </label>
                  <input
                    type="url"
                    id="coupleImage"
                    name="coupleImage"
                    value={formData.coupleImage}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="storyImage" className="block text-sm font-medium text-gray-900">
                    Story Image URL
                  </label>
                  <input
                    type="url"
                    id="storyImage"
                    name="storyImage"
                    value={formData.storyImage}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="eventImage" className="block text-sm font-medium text-gray-900">
                    Event Image URL
                  </label>
                  <input
                    type="url"
                    id="eventImage"
                    name="eventImage"
                    value={formData.eventImage}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="rsvpImage" className="block text-sm font-medium text-gray-900">
                    RSVP Image URL
                  </label>
                  <input
                    type="url"
                    id="rsvpImage"
                    name="rsvpImage"
                    value={formData.rsvpImage}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="giftImage" className="block text-sm font-medium text-gray-900">
                    Gift Image URL
                  </label>
                  <input
                    type="url"
                    id="giftImage"
                    name="giftImage"
                    value={formData.giftImage}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* Audio URL */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-900">
              Audio
            </legend>
            <div className="mt-4">
              <label htmlFor="audioUrl" className="block text-sm font-medium text-gray-900">
                Background Music URL
              </label>
              <input
                type="url"
                id="audioUrl"
                name="audioUrl"
                value={formData.audioUrl}
                onChange={handleChange}
                placeholder="https://example.com/music.mp3"
                className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>
          </fieldset>

          {/* Venue Map URL */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-900">
              Venue Map
            </legend>
            <div className="mt-4">
              <label htmlFor="venueMapUrl" className="block text-sm font-medium text-gray-900">
                Google Maps URL
              </label>
              <input
                type="url"
                id="venueMapUrl"
                name="venueMapUrl"
                value={formData.venueMapUrl}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
              />
            </div>
          </fieldset>

          {/* Gallery */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-900">
              Gallery
            </legend>
            <div className="mt-4 space-y-4">
              {formData.gallery.map((item, index) => (
                <div key={index} className="border p-4 rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) => handleArrayChange(index, "url", e.target.value, "gallery")}
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Caption
                      </label>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => handleArrayChange(index, "caption", e.target.value, "gallery")}
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromArray(index, "gallery")}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToArray("gallery", { url: "", caption: "" })}
                className="mt-2 text-amber-600 hover:text-amber-800 text-sm"
              >
                + Add Gallery Item
              </button>
            </div>
          </fieldset>

          {/* Story */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-900">
              Our Story
            </legend>
            <div className="mt-4 space-y-4">
              {formData.story.map((item, index) => (
                <div key={index} className="border p-4 rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Year
                      </label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => handleArrayChange(index, "year", e.target.value, "story")}
                        placeholder="2023"
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleArrayChange(index, "title", e.target.value, "story")}
                        placeholder="First Meet"
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Story Text
                      </label>
                      <textarea
                        value={item.text}
                        onChange={(e) => handleArrayChange(index, "text", e.target.value, "story")}
                        rows="3"
                        placeholder="Our love story began..."
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromArray(index, "story")}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToArray("story", { year: "", title: "", text: "" })}
                className="mt-2 text-amber-600 hover:text-amber-800 text-sm"
              >
                + Add Story Item
              </button>
            </div>
          </fieldset>

          {/* Bank Accounts */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-900">
              Bank Accounts for Gifts
            </legend>
            <div className="mt-4 space-y-4">
              {formData.bankAccounts.map((item, index) => (
                <div key={index} className="border p-4 rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={item.bankName}
                        onChange={(e) => handleArrayChange(index, "bankName", e.target.value, "bankAccounts")}
                        placeholder="BCA"
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Account Holder
                      </label>
                      <input
                        type="text"
                        value={item.accountHolder}
                        onChange={(e) => handleArrayChange(index, "accountHolder", e.target.value, "bankAccounts")}
                        placeholder="John Doe"
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={item.accountNumber}
                        onChange={(e) => handleArrayChange(index, "accountNumber", e.target.value, "bankAccounts")}
                        placeholder="1234567890"
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromArray(index, "bankAccounts")}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToArray("bankAccounts", { bankName: "", accountHolder: "", accountNumber: "" })}
                className="mt-2 text-amber-600 hover:text-amber-800 text-sm"
              >
                + Add Bank Account
              </button>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {loading ? "Creating..." : "Create Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
