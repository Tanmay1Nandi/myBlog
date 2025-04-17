import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div className="mb-20">
          <h1 className='text-3xl font-semibold text-center my-7'>About This Blog</h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>This is my first complete MERN project, its build in vite and includes many react packages like spinner of reat quill new.</p>
            <p>It was a great challenge building this whole wwebsite, but I am very happy to complete it now.</p>
            <p>Hope everyone likes it, thanks for looking at it.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
