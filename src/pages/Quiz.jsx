import quizData from "../question.json";
import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";

export default function Quiz() {
  // State management for timer, user answers, selected options, and current question
  const navigate = useNavigate();
  const [timer, setTimer] = useState(30);
  const [inputAnswer, setInputAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  // Effect to handle countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          handleNextQuestion(); // Auto move to the next question when timer reaches zero
          return 30;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion]);

  // Function to handle moving to the next question
  const handleNextQuestion = () => {
    userAnswers.push({
      ...quizData[currentQuestion - 1],
      status: selectedOption || inputAnswer ? "answered" : "unanswered", // Check if user has answered
      isAnsCorrect:
        quizData[currentQuestion - 1].correctAnswer === selectedOption ||
        quizData[currentQuestion - 1].correctAnswer === +inputAnswer
          ? true
          : false,
    });

    setSelectedOption(null);
    setInputAnswer("");
    setTimer(30);

    if (currentQuestion < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert("Quiz completed!");
      const calculateScore = () => {
        return userAnswers.filter((answer) => answer.isAnsCorrect).length;
      };
      const request = indexedDB.open("QuizHistory", 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("history", { keyPath: "id", autoIncrement: true });
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("history", "readwrite");
        const store = transaction.objectStore("history");
        store.add({ userAnswers, score: calculateScore(), date: new Date() });
      };
      navigate("/scorecard", {
        state: { score: calculateScore() },
      });
    }
  };

  // Function to handle selecting multiple-choice options
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Function to handle input change for integer-type answers
  const handleInputChange = (e) => {
    setInputAnswer(e.target.value);
  };

  return (
    <div className="flex">
      {/* Main Quiz Section */}
      <div className="w-[70svw] h-screen">
        {/* Header Section with Timer */}
        <div className="bg-indigo-700 flex justify-between items-center px-10 py-5 text-white">
          <h1 className="text-2xl font-bold">Question {currentQuestion}</h1>
          <p className={`text-md font-medium ${timer <= 10 && "text-red-600"}`}>
            {timer} seconds
          </p>
        </div>
        {/* Display Quiz Question and Options */}
        <div className="p-5 space-y-5">
          <p className="text-2xl font-bold">
            {quizData[currentQuestion - 1].question}
          </p>
          {quizData[currentQuestion - 1].type === "multiple-choice" && (
            <div className="space-y-5">
              {quizData[currentQuestion - 1].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-5">
                  <input
                    type="radio"
                    name="option"
                    id={`option-${index + 1}`}
                    checked={selectedOption === option}
                    onChange={() => handleOptionSelect(option)}
                  />
                  <label htmlFor={`option-${index + 1}`}>{option}</label>
                </div>
              ))}
            </div>
          )}
          {quizData[currentQuestion - 1].type === "integer" && (
            <input
              type="number"
              name="answer"
              id="answer"
              className="border border-gray-300 p-2 rounded"
              value={inputAnswer}
              onChange={handleInputChange}
            />
          )}
        </div>
        {/* Next Button */}
        <div className="p-5 absolute bottom-0 right-[30svw]">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={handleNextQuestion}
          >
            {currentQuestion === quizData.length ? "Finish" : "Next"}
          </button>
        </div>
      </div>

      {/* Question Grid Section */}
      <div className="w-[30svw] h-screen bg-indigo-100 p-5 space-y-10">
        <h1 className="text-3xl font-bold">Total Questions</h1>
        <div className="grid grid-cols-4 gap-5">
          {quizData.map((question, index) => {
            let bgColor = "bg-indigo-300 text-indigo-900"; // Default color for unanswered questions
            if (
              userAnswers[index] &&
              userAnswers[index].status === "answered"
            ) {
              bgColor = "bg-green-600 text-white"; // Green for answered questions
            } else if (
              userAnswers[index] &&
              userAnswers[index].status === "unanswered"
            ) {
              bgColor = "bg-red-500 text-white"; // Red for unanswered questions
            } else if (index + 1 === currentQuestion) {
              bgColor = "bg-indigo-600 text-white"; // Highlight current question in blue
            }

            return (
              <div
                key={index}
                className={`size-14 flex justify-center items-center rounded cursor-pointer ${bgColor}`}
              >
                <p>{index + 1}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
