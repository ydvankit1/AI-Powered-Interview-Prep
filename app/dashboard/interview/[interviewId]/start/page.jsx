"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params }) {

  const resolvedParams = React.use(params);
  const interviewId = resolvedParams.interviewId;

  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  React.useEffect(() => {
    console.log(interviewId);
    GetInterviewDetails(interviewId);
  }, [interviewId]);

  const GetInterviewDetails = async (id) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, id));
      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      console.log(jsonMockResp)
      if (Array.isArray(jsonMockResp)) {
        setMockInterviewQuestion(jsonMockResp);
      } else {
        console.error('The fetched data is not an array', jsonMockResp);
        setMockInterviewQuestion([]);
      }
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>

        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className='flex justify-end gap-6'>
        {activeQuestionIndex > 0 &&
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 &&
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
        {activeQuestionIndex == mockInterviewQuestion?.length - 1 &&
          <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
            <Button>End Interview</Button>
          </Link>}
      </div>
    </div>
  )
}

export default StartInterview 