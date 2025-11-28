"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Eye, Users } from "lucide-react";
import moment from "moment";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/invitations");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch invitations");
      }
      const data = await res.json();
      setInvitations(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching invitations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this invitation?")) {
      return;
    }

    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete invitation");
      }

      setInvitations(invitations.filter((inv) => inv._id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting invitation:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 text-center">
        <p className="text-gray-600">Loading invitations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Invitations
        </h2>
        <div className="flex gap-3">
          <Link
            href="/admin/dashboard/templates"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition"
          >
            <Eye size={18} />
            Browse Templates
          </Link>
          <Link
            href="/admin/dashboard/invitations/create"
            className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition"
          >
            <PlusCircle size={18} />
            Create New
          </Link>
        </div>
      </div>

      {invitations.length === 0 ? (
        <p className="text-gray-600">
          No invitations created yet. Click "Create New" to get started!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Slug
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Couple
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Wedding Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Template
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <tr key={invitation._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link
                      href={`/v/${invitation.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {invitation.slug}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invitation.bride.name} & {invitation.groom.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {moment(invitation.weddingDate).format("MMMM DD, YYYY")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invitation.templateId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <Link
                        href={`/v/${invitation.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                        title="View Invitation"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/dashboard/invitations/${invitation._id}/guests`}
                        className="text-amber-600 hover:text-amber-900"
                        title="Generate Guest Links"
                      >
                        <Users size={18} />
                      </Link>
                      <Link
                        href={`/admin/dashboard/invitations/${invitation._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit Invitation"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(invitation._id)}
                        disabled={deletingId === invitation._id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Invitation"
                      >
                        {deletingId === invitation._id ? (
                          "Deleting..."
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
