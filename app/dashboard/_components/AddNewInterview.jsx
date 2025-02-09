"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAImodel'
import { LayoutList, LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setjobPosition] = useState();
  const [jobDesc, setjobDesc] = useState();
  const [jobExperience, setjobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    console.log(jobDesc, jobPosition, jobExperience);

    const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Experience: ${jobExperience}. Depend on Job position, Job Description, and years of experience, give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions along with answers in JSON format. Use "question" and "answer" fields in the JSON.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);

      const rawResponse = await result.response.text();
      console.log("Raw Response:", rawResponse);


      const cleanedResponse = rawResponse
        .replace(/```json|```/g, '')
        .replace(/^[\s\n]*|[\s\n]*$/g, '');

      console.log("Cleaned Response:", cleanedResponse);

      let parsedJson;
      try {
        parsedJson = JSON.parse(cleanedResponse);
        console.log("Parsed JSON:", parsedJson);
      } catch (err) {
        console.error("Error parsing JSON:", cleanedResponse);
        alert("The AI response is not valid JSON. Please check the response format.");
        return;
      }

      if (parsedJson) {
        const resp = await db.insert(MockInterview).values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsedJson),
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY'),
        }).returning({ mockId: MockInterview.mockId });

        console.log("Inserted ID:", resp);
        if (resp) {
          setOpenDialog(false);
          router.push('/dashboard/interview/' + resp[0]?.mockId);
        }
      } else {
        console.error("No valid JSON response from the AI model.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate or process interview questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className='p-10 border-rounded-lg bg-secondary 
        hover:scale-105 hover: shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)}
      >
        <h2 className=' text-lg text-center'>+ Launch Interview</h2>
      </div>
      <Dialog open={openDialog}>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about Job interviewing </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>Add Details about your Job position/role, Job description and years of experience</h2>

                  <div className='mt-7 my-3'>
                    <label className="block">Job Role / Job Position</label>
                    <Textarea placeholder='ex. Full Stack Developer' required
                      onChange={(event) => setjobPosition(event.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label className="block">Job Description / Tech Stack (in short)</label>
                    <Textarea placeholder='ex. React Js, My sql etc.' required
                      onChange={(event) => setjobDesc(event.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label className="block">Years of Experience</label>
                    <Textarea placeholder='Ex.5' type="number" max="50" required
                      onChange={(event) => setjobExperience(event.target.value)}
                    />
                  </div>

                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading} >
                    {
                      loading ?
                        <>
                          <LoaderCircle className='animate-spin' />'Generating from AI'
                        </>
                        : 'Start Interview'
                    }
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default AddNewInterview

