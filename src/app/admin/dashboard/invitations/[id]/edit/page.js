"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

const defaultFormData = {
  slug: "",
  templateId: "modern-javanese",
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
};

export default function EditInvitationPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [urlOrigin, setUrlOrigin] = useState("");
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    setUrlOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await fetch(`/api/invitations/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch invitation");
        }
        const data = await res.json();

        // Format weddingDate for datetime-local input
        if (data.weddingDate) {
          data.weddingDate = moment(data.weddingDate).format(
            "YYYY-MM-DDTHH:mm"
          );
        }

        // Merge with defaultFormData to ensure all fields exist (fixes uncontrolled input warning)
        setFormData({ ...defaultFormData, ...data });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching invitation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [id]);

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
    // Handle nested state for groom, bride
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
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare payload
      const payload = { ...formData };
      console.log("DEBUG: Submitting payload:", payload);
      console.log("DEBUG: venueMapUrl value:", payload.venueMapUrl);

      // Clean up data based on template
      if (payload.templateId === "sunda") {
        payload.events = [];
        payload.groom = { ...payload.groom, parents: "", photoUrl: "" };
        payload.bride = { ...payload.bride, parents: "", photoUrl: "" };
        payload.heroQuote = "";
        payload.hashtag = "";
        payload.dressCodeInfo = "";
        payload.giftMessage = "";
        // weddingDate might be empty string, which causes CastError.
        // If it's sunda, we might not need it, or we should ensure it's not sent if empty.
        if (!payload.weddingDate) delete payload.weddingDate;
      } else {
        // For other templates, also clean up weddingDate if empty
        if (!payload.weddingDate) delete payload.weddingDate;
      }

      const res = await fetch(`/api/invitations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update invitation");
      }

      setSuccess("Invitation updated successfully!");
      router.push("/admin/dashboard/invitations");
    } catch (err) {
      setError(err.message);
      console.error("Error updating invitation:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isSunda = formData.templateId === "sunda";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-600">Loading invitation data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !submitting) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

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
              Edit Invitation
            </h2>
          </div>
        </div>

        {error && !submitting && (
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
            <legend className="text-lg font-medium text-gray-800">
              Basic Information
            </legend>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700"
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
                  className="block text-sm font-medium text-gray-700"
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
              <div>
                <label
                  htmlFor="metaDescription"
                  className="block text-sm font-medium text-gray-700"
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
            <legend className="text-lg font-medium text-gray-800">
              Groom Information
            </legend>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="groom.name"
                  className="block text-sm font-medium text-gray-700"
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
                      htmlFor="groom.parents"
                      className="block text-sm font-medium text-gray-700"
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
                  <div>
                    <label
                      htmlFor="groom.photoUrl"
                      className="block text-sm font-medium text-gray-700"
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
                </>
              )}
            </div>
          </fieldset>

          {/* Bride Info */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium text-gray-800">
              Bride Information
            </legend>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="bride.name"
                  className="block text-sm font-medium text-gray-700"
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
                      htmlFor="bride.parents"
                      className="block text-sm font-medium text-gray-700"
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
                  <div>
                    <label
                      htmlFor="bride.photoUrl"
                      className="block text-sm font-medium text-gray-700"
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
                </>
              )}
            </div>
          </fieldset>

          {/* Wedding Date */}
          {!isSunda && (
            <fieldset className="border p-4 rounded-lg">
              <legend className="text-lg font-medium text-gray-800">
                Wedding Date
              </legend>
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="weddingDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    id="weddingDate"
                    name="weddingDate"
                    value={formData.weddingDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Note: Timezone might affect display on invitation.
                  </p>
                </div>
              </div>
            </fieldset>
          )}

          {/* Events */}
          {!isSunda && (
            <fieldset className="border p-4 rounded-lg">
              <legend className="text-lg font-medium flex justify-between items-center text-gray-800">
                Events
                <button
                  type="button"
                  onClick={() =>
                    addToArray("events", {
                      title: "",
                      date: "",
                      time: "",
                      venueName: "",
                      venueAddress: "",
                      venueMapUrl: "",
                    })
                  }
                  className="text-amber-600 hover:text-amber-800 text-sm"
                >
                  Add Event
                </button>
              </legend>
              <div className="mt-4 space-y-4">
                {formData.events.map((event, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded-md bg-gray-50 space-y-3 relative"
                  >
                    <h3 className="text-md font-medium text-gray-800">
                      Event #{index + 1}
                    </h3>
                    {formData.events.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFromArray(index, "events")}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                      >
                        <X size={18} />
                      </button>
                    )}
                    <div>
                      <label
                        htmlFor={`event-title-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id={`event-title-${index}`}
                        value={event.title}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "title",
                            e.target.value,
                            "events"
                          )
                        }
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`event-date-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date (e.g., Saturday, November 12, 2026)
                      </label>
                      <input
                        type="text"
                        id={`event-date-${index}`}
                        value={event.date}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "date",
                            e.target.value,
                            "events"
                          )
                        }
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`event-time-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Time (e.g., 10:00 WIB)
                      </label>
                      <input
                        type="text"
                        id={`event-time-${index}`}
                        value={event.time}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "time",
                            e.target.value,
                            "events"
                          )
                        }
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`event-venueName-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Venue Name
                      </label>
                      <input
                        type="text"
                        id={`event-venueName-${index}`}
                        value={event.venueName}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "venueName",
                            e.target.value,
                            "events"
                          )
                        }
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`event-venueAddress-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Venue Address
                      </label>
                      <textarea
                        id={`event-venueAddress-${index}`}
                        value={event.venueAddress}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "venueAddress",
                            e.target.value,
                            "events"
                          )
                        }
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label
                        htmlFor={`event-venueMapUrl-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Venue Map URL
                      </label>
                      <input
                        type="url"
                        id={`event-venueMapUrl-${index}`}
                        value={event.venueMapUrl}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "venueMapUrl",
                            e.target.value,
                            "events"
                          )
                        }
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {/* Gallery */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium flex justify-between items-center">
              Gallery
              <button
                type="button"
                onClick={() => addToArray("gallery", { url: "", caption: "" })}
                className="text-amber-600 hover:text-amber-800 text-sm"
              >
                Add Image
              </button>
            </legend>
            <div className="mt-4 space-y-4">
              {formData.gallery.map((item, index) => (
                <div
                  key={index}
                  className="border p-3 rounded-md bg-gray-50 space-y-3 relative"
                >
                  <h3 className="text-md font-medium text-gray-800">
                    Image #{index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeFromArray(index, "gallery")}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <X size={18} />
                  </button>
                  <div>
                    <label
                      htmlFor={`gallery-url-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Image URL
                    </label>
                    <input
                      type="url"
                      id={`gallery-url-${index}`}
                      value={item.url}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "url",
                          e.target.value,
                          "gallery"
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`gallery-caption-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Caption
                    </label>
                    <input
                      type="text"
                      id={`gallery-caption-${index}`}
                      value={item.caption}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "caption",
                          e.target.value,
                          "gallery"
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Love Story */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium flex justify-between items-center">
              Love Story Timeline
              <button
                type="button"
                onClick={() =>
                  addToArray("story", { year: "", title: "", text: "" })
                }
                className="text-amber-600 hover:text-amber-800 text-sm"
              >
                Add Story Item
              </button>
            </legend>
            <div className="mt-4 space-y-4">
              {formData.story.map((item, index) => (
                <div
                  key={index}
                  className="border p-3 rounded-md bg-gray-50 space-y-3 relative"
                >
                  <h3 className="text-md font-medium text-gray-800">
                    Story Item #{index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeFromArray(index, "story")}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <X size={18} />
                  </button>
                  <div>
                    <label
                      htmlFor={`story-year-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Year
                    </label>
                    <input
                      type="text"
                      id={`story-year-${index}`}
                      value={item.year}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "year",
                          e.target.value,
                          "story"
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`story-title-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id={`story-title-${index}`}
                      value={item.title}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "title",
                          e.target.value,
                          "story"
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`story-text-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Text
                    </label>
                    <textarea
                      id={`story-text-${index}`}
                      value={item.text}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "text",
                          e.target.value,
                          "story"
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      required
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Section Images (For Static Templates) */}
          {isSunda && (
            <fieldset className="border p-4 rounded-lg">
              <legend className="text-lg font-medium text-gray-900">
                Section Images (For Static Templates)
              </legend>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="heroImage"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Page 1 Image URL (Hero)
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
                  <label
                    htmlFor="coupleImage"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Page 2 Image URL (Pesan-pesan)
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
                  <label
                    htmlFor="storyImage"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Page 3 Image URL (Detail Event)
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
                  <label
                    htmlFor="eventImage"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Page 4 Image URL (Venue)
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
                  <label
                    htmlFor="venueMapUrl"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Venue Map URL (Google Maps)
                  </label>
                  <input
                    type="url"
                    id="venueMapUrl"
                    name="venueMapUrl"
                    value={formData.venueMapUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                    placeholder="https://goo.gl/maps/..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="rsvpImage"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Page 5 Image URL (Bride)
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
                  <label
                    htmlFor="giftImage"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Page 6 Image URL (Groom)
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
                <div>
                  <label
                    htmlFor="footerImage"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Page 7 Image URL (Gallery - Unused, use Gallery section
                    below)
                  </label>
                  <input
                    type="url"
                    id="footerImage"
                    name="footerImage"
                    value={formData.footerImage}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="desktopImage"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Desktop Left Side Image URL (Static)
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
              </div>
            </fieldset>
          )}

          {/* Other Details */}
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-medium">Other Details</legend>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="coverImage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cover Image URL (Opening Modal Only)
                </label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                />
                <p className="mt-1 text-xs text-gray-700">
                  Image for landing page background (before opening invitation)
                </p>
              </div>
              <div>
                <label
                  htmlFor="audioUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Background Music URL
                </label>
                <input
                  type="url"
                  id="audioUrl"
                  name="audioUrl"
                  value={formData.audioUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                />
              </div>
              {!isSunda && (
                <>
                  <div>
                    <label
                      htmlFor="heroQuote"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Hero Section Quote
                    </label>
                    <textarea
                      id="heroQuote"
                      name="heroQuote"
                      value={formData.heroQuote}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="hashtag"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Hashtag (e.g., #JasmineBayuWedding)
                    </label>
                    <input
                      type="text"
                      id="hashtag"
                      name="hashtag"
                      value={formData.hashtag}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dressCodeInfo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Dress Code Information
                    </label>
                    <textarea
                      id="dressCodeInfo"
                      name="dressCodeInfo"
                      value={formData.dressCodeInfo}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                    ></textarea>
                  </div>
                </>
              )}

              {!isSunda && (
                <div className="flex items-center">
                  <input
                    id="showGiftSection"
                    name="showGiftSection"
                    type="checkbox"
                    checked={formData.showGiftSection}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        showGiftSection: e.target.checked,
                      }))
                    }
                    className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="showGiftSection"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Show Gift Section
                  </label>
                </div>
              )}

              {(isSunda || formData.showGiftSection) && (
                <div className="space-y-4">
                  {!isSunda && (
                    <div>
                      <label
                        htmlFor="giftMessage"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gift Section Message
                      </label>
                      <textarea
                        id="giftMessage"
                        name="giftMessage"
                        value={formData.giftMessage}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                      ></textarea>
                    </div>
                  )}
                  <fieldset className="border p-4 rounded-lg bg-gray-50">
                    <legend className="text-md font-medium flex justify-between items-center">
                      Bank Accounts
                      <button
                        type="button"
                        onClick={() =>
                          addToArray("bankAccounts", {
                            bankName: "",
                            accountHolder: "",
                            accountNumber: "",
                          })
                        }
                        className="text-amber-600 hover:text-amber-800 text-sm"
                      >
                        Add Account
                      </button>
                    </legend>
                    <div className="mt-4 space-y-4">
                      {formData.bankAccounts.map((account, index) => (
                        <div
                          key={index}
                          className="border p-3 rounded-md bg-white space-y-3 relative"
                        >
                          <h4 className="text-sm font-medium text-gray-800">
                            Bank Account #{index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              removeFromArray(index, "bankAccounts")
                            }
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                          <div>
                            <label
                              htmlFor={`bank-name-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Bank Name
                            </label>
                            <input
                              type="text"
                              id={`bank-name-${index}`}
                              value={account.bankName}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "bankName",
                                  e.target.value,
                                  "bankAccounts"
                                )
                              }
                              className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`account-holder-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Account Holder
                            </label>
                            <input
                              type="text"
                              id={`account-holder-${index}`}
                              value={account.accountHolder}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "accountHolder",
                                  e.target.value,
                                  "bankAccounts"
                                )
                              }
                              className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`account-number-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Account Number
                            </label>
                            <input
                              type="text"
                              id={`account-number-${index}`}
                              value={account.accountNumber}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  "accountNumber",
                                  e.target.value,
                                  "bankAccounts"
                                )
                              }
                              className="mt-1 block w-full rounded-md border border-gray-400 bg-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm text-gray-900 placeholder-gray-500"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={submitting}
            className="w-full justify-center inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-all hover:shadow-xl"
          >
            {submitting ? "Updating..." : "Update Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
}
