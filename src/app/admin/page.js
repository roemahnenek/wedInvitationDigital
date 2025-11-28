"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/login');
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Redirecting to admin login...</p>
    </main>
  );
}
