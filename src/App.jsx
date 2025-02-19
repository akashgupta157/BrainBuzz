import React from "react";
import { useNavigate } from "react-router";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex justify-center items-center p-4">
      <div className="w-full sm:w-fit p-5 rounded-2xl space-y-5 bg-white drop-shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold">Quiz Instructions:</h1>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            For multiple-choice questions, select the one best answer (A, B, C,
            or D)
          </li>
          <li>
            For integer-type questions, write your numerical answer clearly.
          </li>
          <li>No calculators unless specified.</li>
          <li>You have 30 minutes to complete this quiz.</li>
        </ol>
        <div className="flex justify-end">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={() => navigate("/quiz")}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}