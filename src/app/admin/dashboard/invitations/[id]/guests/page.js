"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Copy, Check, Users, ExternalLink } from "lucide-react";

export default function InvitationGuestsPage({ params }) {
  const { id } = params;
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [guestNames, setGuestNames] = useState("");
  const [generatedLinks, setGeneratedLinks] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await fetch(`/api/invitations/${id}`);
        if (!res.ok) throw new Error("Failed to fetch invitation");
        const data = await res.json();
        setInvitation(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [id]);

  const handleGenerate = () => {
    if (!guestNames.trim()) return;

    const names = guestNames.split("\n").filter((name) => name.trim() !== "");
    const origin = window.location.origin;

    const links = names.map((name) => ({
      name: name.trim(),
      url: `${origin}/v/${invitation.slug}?name=${encodeURIComponent(
        name.trim()
      )}`,
    }));

    setGeneratedLinks(links);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard/invitations"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Generate Guest Links
              </h1>
              <p className="text-sm text-gray-600">
                For:{" "}
                <span className="font-medium">
                  {invitation.bride.name} & {invitation.groom.name}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-amber-600" />
              Input Guest Names
            </h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Enter names (one per line):
              </label>
              <textarea
                value={guestNames}
                onChange={(e) => setGuestNames(e.target.value)}
                className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 placeholder-gray-400 resize-none"
                placeholder="Budi Santoso&#10;Siti Aminah&#10;Joko Widodo"
              ></textarea>
            </div>
            <button
              onClick={handleGenerate}
              disabled={!guestNames.trim()}
              className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              Generate Links
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <ExternalLink size={20} className="text-blue-600" />
                Generated Links
              </h2>
              {generatedLinks.length > 0 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {generatedLinks.length} links
                </span>
              )}
            </div>

            {generatedLinks.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <Users className="mx-auto text-gray-300 mb-3" size={48} />
                <p>No links generated yet.</p>
                <p className="text-sm mt-1">Input names and click Generate.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {generatedLinks.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 group hover:border-amber-300 transition hover:shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">
                        {item.name}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.url, index)}
                        className="text-gray-400 hover:text-amber-600 transition p-1 rounded-md hover:bg-amber-50"
                        title="Copy Link"
                      >
                        {copiedIndex === index ? (
                          <Check size={18} className="text-green-600" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 break-all bg-white p-2 rounded-lg border border-gray-100 font-mono select-all">
                      {item.url}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
