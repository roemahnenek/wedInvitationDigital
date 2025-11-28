"use client"


import  { useState} from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isAttending, setIsAttending] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true),
    setStatus("");

    try {
      const res = await fetch("/api/guests", {

        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, message, isAttending})

      });
      if(!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setStatus("Terima kasih! Data kamu sudah tersimpan.")
      setName("")
      setMessage("")
      setIsAttending(true)
      } catch (error) {
        console.error(error)
        setStatus("Gagal menyimpan, coba lagi ya.")
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-100 px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Undangan Digital
      </h1>

      {/* di sini nanti kamu bisa taruh komponen gambar undangan */}
      <div className="w-full max-w-md mb-6">
        <div className="w-full aspect-[3/4] bg-gray-300 rounded-2xl flex items-center justify-center">
          <span className="text-gray-600 text-sm">
            Tempat gambar undangan (poster)
          </span>
        </div>
      </div>

      {/* FORM RSVP */}
      <form
        onSubmit={handleSubmit}
        className="mt-2 w-full max-w-md bg-white rounded-2xl shadow-md p-4 space-y-3"
      >
        <h2 className="text-base font-semibold mb-1 text-center">
          Konfirmasi Kehadiran
        </h2>

        <input
          type="text"
          placeholder="Nama kamu"
          className="w-full border rounded-lg px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Ucapan untuk mempelai (optional)"
          className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex items-center justify-between text-sm">
          <span>Apakah kamu akan hadir?</span>
          <select
            className="border rounded-lg px-2 py-1 text-sm"
            value={isAttending ? "yes" : "no"}
            onChange={(e) => setIsAttending(e.target.value === "yes")}
          >
            <option value="yes">Hadir</option>
            <option value="no">Tidak bisa hadir</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-lg py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Kirim Konfirmasi"}
        </button>

        {status && (
          <p className="text-xs text-center mt-2 text-gray-600">{status}</p>
        )}
      </form>

      <p className="mt-6 text-xs text-gray-400">
        Undangan digital dengan Next.js + MongoDB
      </p>
    </main>
  );
}