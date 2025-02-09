import { UserButton } from '@clerk/nextjs'
import AddNewInterview from './_components/AddNewInterview'
import React from 'react'
import InterviewList from './_components/InterviewList'

function Dashboard() {
  return (
    <div className=' p-10'>
      <h2 className='text-gray-500'>Prepare with confidence—start your AI-powered mock interview today!</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInterview/>
      </div>
      <InterviewList/>
    </div>
  )
}

export default Dashboard