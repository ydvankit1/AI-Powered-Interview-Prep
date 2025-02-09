"use client";
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/utils/db'
import { useState, useEffect } from 'react';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';


function Feedback() {

  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const params = useParams();
  const router = useRouter(); 
  console.log("Route params:", params);

  useEffect(() => {
    GetFeedback()
  }, [])


  const GetFeedback = async () => {
    console.log("Params received in Feedback:", params);
    try {
      if (!params || !params.interviewId) {
        console.error("Params missing", params);
        return;
      }
      console.log("Querying with mockIdRef:", params.interviewId);
      const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id)
      console.log("Fetched feedback:", result);
      setFeedbackList(result);

      if (result.length > 0) {
        const totalRating = result
          .map(item => parseFloat(item.rating) || 0)
          .reduce((acc, curr) => acc + curr, 0);
        const avgRating = (totalRating / result.length).toFixed(1);
        setAverageRating(avgRating);
      } else {
        setAverageRating(null);
      }

    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  }

  return (
    <div className='p-10'>
     
      {
      feedbackList?.length==0?
      <h2 className='font-bold-text-xl text-gray-500'>No Interview Feedback Record Found</h2>
      :
      <>
       <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
       <h2 className='font-bold text-2xl:'>Here is your interview feedback</h2>
      <h2 className='text-primary text-lg my-3'>your overall all interview rating: <strong>{averageRating ? `${averageRating}/5` : "Not Rated"}</strong></h2>
      <h2 className='text-sm text-gray-500'>find below correct answer of interview questions with your anwer and feedback for improvement</h2>

      {
        feedbackList && feedbackList.map((item, index) => (

          <Collapsible key={index} className='mt-7'>
            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
            {item.question}<ChevronsUpDown className='h-5 w-5'/>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div flex flex-col gap-2> 
                <h2 className='text-red-500 p-2 border rounded-lg'>
                  <strong>
                    Rating:
                  </strong>
                  {item.rating}
                </h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'>
                  <strong>
                    Your Answer: 
                  </strong>
                  {item.userAns}
                </h2>
                <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'>
                  <strong>
                    Correct Answer: 
                  </strong>
                  {item.correctAns}
                </h2>
                <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'>
                  <strong>
                    Feedback: 
                  </strong>
                  {item.feedback}
                </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
          </>}
        <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>

    </div>
  )
}

export default Feedback 