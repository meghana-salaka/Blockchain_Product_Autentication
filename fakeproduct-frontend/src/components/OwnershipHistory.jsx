import React from "react";

export default function OwnershipHistory({ history }) {
  return (
    <div className="mt-6 bg-gray-800 p-6 rounded-xl text-white">
      <h2 className="text-2xl font-bold mb-4">Ownership History</h2>
      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((entry, index) => (
            <li key={index} className="bg-gray-700 p-3 rounded-lg flex justify-between">
              <span>Owner: {entry.owner}</span>
              <span>Date: {new Date(entry.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
