"use client";
import { text } from 'drizzle-orm/mysql-core';
import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion = [], activeQuestionIndex }) {

  let isSpeaking = false;

const textToSpeech = (text) => {
  if (!text) return;

  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;

    if (isSpeaking) {
      synth.cancel();
      isSpeaking = false;
    } else {
      const speech = new SpeechSynthesisUtterance(text);
      speech.onend = () => (isSpeaking = false); 
      speech.onerror = () => (isSpeaking = false); 

      synth.speak(speech);
      isSpeaking = true;
    }
  } else {
    alert("Sorry, your browser does not support text-to-speech.");
  }
};


  return mockInterviewQuestion && (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion && mockInterviewQuestion.length > 0 ? (
          mockInterviewQuestion.map((question, index) => (
            <h2
              className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer 
              ${activeQuestionIndex === index ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
              key={index}

            >
              Question # {index + 1}
            </h2>
          ))
        ) : (
          <p>No questions available</p>
        )}
      </div>
      <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
      <Volume2 className="cursor-pointer" onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)} />
      <div className='border rounded-lg p-5 bg-blue-200 '>
        <h2 className='flex gap-2 items-center text-primary'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-primary my-2'>
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </h2>
      </div>
    </div>
  );
}

export default QuestionsSection;
