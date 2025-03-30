import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left side */}
        <div className="flex-1">
        <Link to="/" className='text-4xl font-bold'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Tanu's</span>
            Blog
        </Link>
        <p className='text-sm mt-5'>This is my blog, welcome everyone.This is my blog, welcome everyoneThis is my blog, welcome everyone</p>
        </div>

        {/* right side */}
        <div className="flex-1">
          <div className="">
            <form className='flex flex-col gap-4'>
              <div className="">
                <Label htmlFor='username'>Your username</Label>
                <TextInput type='text' placeholder='Username' id='username' />
              </div>
              <div className="">
                <Label>Your email</Label>
                <TextInput type='text' placeholder='abc@gmail.com' id='email' />
              </div>
              <div className="">
                <Label>Your password</Label>
                <TextInput type='text' placeholder='Password' id='password' />
              </div>
              <Button type='submit' className='bg-gradient-to-r from-purple-500 to-pink-500'>Sign Up</Button>
            </form>
            <div className="flex gap-2 text-sm mt-5" >
              <span>Have an Account?</span>
              <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
