import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          Order Cancelled
        </h2>
        <p className="text-gray-700 mb-4">Your order has been cancelled.</p>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
          RETURN TO SHOP
        </button>
      </div>
    </div>
  );
}
