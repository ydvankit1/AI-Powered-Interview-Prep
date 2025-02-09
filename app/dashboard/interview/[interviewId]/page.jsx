
"use client";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import React, { useState } from "react";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

function Interview({ params }) {
  const resolvedParams = React.use(params);
  const interviewId = resolvedParams.interviewId;

  const [interviewData, setInterviewData] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  React.useEffect(() => {
    GetInterviewDetails(interviewId);
  }, [interviewId]);

  const GetInterviewDetails = async (id) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, id));
      setInterviewData(result[0] || null);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
      <div className="my-10">
        <h2 className="font-bold text-2xl">Let's Get Started</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-col my-2 gap-2">
            <div className="flex flex-col p-1 rounded-lg border gap-5">

              {interviewData ? (
                <>
                  <h2 className="text-lg">
                    <strong>Job Role/Job Position:</strong> {interviewData.jobPosition}
                  </h2>
                  <h2 className="text-lg">
                    <strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}
                  </h2>
                  <h2 className="text-lg">
                    <strong>Years of Experience:</strong> {interviewData.jobExperience}
                  </h2>
                </>
              ) : (
                <p>Loading interview details...</p>
              )}
            </div>
            <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
              <h2 className="flex gap-2 items-center text-yellow-500">
                <Lightbulb />
                <strong>Information</strong>
              </h2>
              <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
          </div>

          <div>
            {webcamEnabled ? (
              <Webcam
                onUserMedia={() => setWebcamEnabled(true)}
                onUserMediaError={() => setWebcamEnabled(false)}
                mirrored={true}
                style={{
                  height: 300,
                  width: 300,
                }}
              />
            ) : (
              <>
                <WebcamIcon className="h-72 w-full my-3 p-20 bg-secondary rounded-lg border" />
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setWebcamEnabled(true)}
                >
                  Enable Web Cam and Microphone
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end items-end">
          <Link href={"/dashboard/interview/" + interviewId + "/start"}>
            <Button>Start Interview</Button>
          </Link>
        </div>
      </div>
    );
}

export default Interview;
