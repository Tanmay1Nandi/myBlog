import React from 'react'
import CallToAction from '../components/CallForAction.jsx'

export default function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center flex-col items-center gap-6 p-3'>
      <div className='mb-18 flex flex-col md:gap-8 justify-center items-center gap-4'>
        <h1 className='text-3xl font-semibold'>Projects</h1>
        <p className='text-md text-gray-500'>Build fun and engaging projects in Javascript by having a look at these 10 projects for any beginner, it will be great fun and great to learn.</p>
        <CallToAction />
      </div>
    </div>
  )
}
