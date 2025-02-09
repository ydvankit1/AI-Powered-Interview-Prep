"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { Mic } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAImodel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { userAgent } from 'next/server';
import { db } from "@/utils/db";

const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {

  const [userAnswer, setUserAnswer] = useState(" ");
  const { user } = useUser();
  const [loading, setloading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });    
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      (async () => {
        await UpdateUserAnswer();
      })();
    }
  }, [userAnswer]);
  

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText()
    }
    else {
      startSpeechToText();
    }
  }

  const UpdateUserAnswer = async () => {
    try {
      console.log("User Answer:", userAnswer);
      setloading(true);
  
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, Answer: ${userAnswer}. Please give a rating and feedback in JSON format (rating and feedback fields).`;
      const result = await chatSession.sendMessage(feedbackPrompt);
  
      const rawResponse = await result.response.text();
      const cleanResponse = rawResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
  
      let JsonFeedbackResp;
      try {
        JsonFeedbackResp = JSON.parse(cleanResponse);
      } catch (err) {
        console.error("Error parsing JSON feedback:", err);
        toast.error('Failed to parse feedback response.');
        setloading(false);
        return;
      }
  
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp.feedback,
        rating: JsonFeedbackResp.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
      });
  
      if (resp) {
        toast.success('User answer saved successfully.');
        setUserAnswer(" ");
        setResults([]);
      }
      setResults([]);
      
    } catch (err) {
      console.error("Error updating user answer:", err);
      toast.error('Failed to save user answer.');
    } finally {
      setloading(false);
    }
  };
  

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className="flex flex-col justify-center items-center bg-black rounded-lg p-10 mt-20 mx-auto relative max-w-lg">

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
          <Image src={'/webcam.png'} width={100} height={100} />
        </div>


        <Webcam
          mirrored={true}
          style={{
            height: 250,
            width: '100%',
            zIndex: 5,
          }}
        />
      </div>


      <Button
        disabled={loading}
        variant="outline" className="my-10"
        onClick={StartStopRecording}>
        {
          isRecording ?
            <h2 className='text-red-600 flex-gap-2'>
              <Mic /> 'Stop Recording'
            </h2>
            :
            "Record Answer"}</Button>
    </div>
  );
}

export default RecordAnswerSection;
