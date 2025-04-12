import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className="flex-1 justify-center flex flex-col">
        <h2 className='text-2xl'>Want to make some Javascript projects?</h2>
        <p className='text-gray-500 my-2'>Here are the top 10 projects for beginners in JavaScript.</p>
        <Button className='bg-gradient-to-br from-purple-500 to-pink-500 rounded-tl-xl rounded-bl-none'><a href='https://www.google.com/' target='_blank' rel='noopener noreferrer'>Top 10 JS projects for beginners</a></Button>
      </div>
      <div className="p-7 flex-1">
        <img src='https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221114110410/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png' />
      </div>
    </div>
  )
}
