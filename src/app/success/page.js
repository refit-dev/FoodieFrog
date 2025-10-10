'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  console.log(sessionId);
  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const response = await fetch(`/api/checkout?session_id=${sessionId}`);
        const data = await response.json();

        const orderItems = data.lineItems.data;
        console.log('Order Items:', orderItems);


        // Handle response data if needed
        const metadata = data.session.metadata;
        let items = [];
        if (metadata?.items) {
          try {
            items = JSON.parse(metadata.items);
            metadata.items = items;
          } catch (e) {
            console.error('Error parsing items metadata:', e);
          }
        }
        console.log('Session Metadata:', metadata);
      } catch (error) {
        console.error('Error fetching checkout:', error);
      }
    };
    if (sessionId) {
      fetchCheckout();
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-green-50 p-8">
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        className="mb-6"
      >
        <circle cx="12" cy="12" r="12" fill="#4BB543" />
        <path
          d="M7 13l3 3 7-7"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className="text-green-600 text-3xl font-bold mb-4">
        Payment Successful!
      </h1>
      <p className="text-gray-700 text-lg text-center max-w-md mb-8">
        Thank you for your purchase. Your payment has been processed
        successfully.
        <br />
        You will receive a confirmation email shortly.
      </p>
      <Link
        href="/"
        className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
