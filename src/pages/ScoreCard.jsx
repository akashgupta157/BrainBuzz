import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function ScoreCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const score = location.state?.score ?? 0; // Prevents crash if state is undefined

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const request = indexedDB.open("QuizHistory", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("history")) {
        db.createObjectStore("history", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("history", "readonly");
      const store = transaction.objectStore("history");
      const getAll = store.getAll();

      getAll.onsuccess = () => {
        setHistory(getAll.result.reverse()); // Ensure latest appears first
      };
    };
  }, []);

  return (
    <div className="px-4">
      {/* Quiz Result */}
      <div className="w-full h-[30svh] flex flex-col justify-center items-center text-center">
        <h1 className="text-3xl font-bold">Quiz Completed!</h1>
        <p className="text-xl">Your Score: {score} / 10</p>
        <button
          className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-200"
          onClick={() => navigate("/")}
        >
          Restart Quiz
        </button>
      </div>

      {/* Quiz History */}
      <h1 className="text-3xl font-bold text-center mt-5">Quiz History</h1>

      <div className="overflow-x-auto mt-5 max-h-[60svh]">
        <table className="w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Score</th>
              <th className="py-2 px-4 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4 text-center">
                  <p>{new Date(record.date).toDateString()}</p>
                  <p>{new Date(record.date).toLocaleTimeString()}</p>
                </td>
                <td className="py-2 px-4 border text-center">
                  {record.score} / {record.userAnswers.length}
                </td>
                <td className="py-2 px-4 border text-center">
                  <details>
                    <summary className="cursor-pointer text-blue-600">
                      View
                    </summary>
                    <div className="overflow-x-auto">
                      <table className="w-full bg-gray-100 border border-gray-300 mt-2">
                        <thead>
                          <tr className="bg-gray-500 text-white">
                            <th className="py-1 px-2 border">Q No.</th>
                            <th className="py-1 px-2 border">Correct Answer</th>
                            <th className="py-1 px-2 border">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {record.userAnswers.map((answer, i) => (
                            <tr key={i}>
                              <td className="py-1 px-2 border text-center">
                                {i + 1}
                              </td>
                              <td className="py-1 px-2 border text-center">
                                {answer.correctAnswer}
                              </td>
                              <td
                                className={`py-1 px-2 border text-center ${
                                  answer.isAnsCorrect
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {answer.isAnsCorrect ? "Correct" : "Incorrect"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
