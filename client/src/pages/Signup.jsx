import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function Signup() {
  const[errorMessage, setErrorMessage] = useState(null);
  const[loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.username || !formData.password){
      return setErrorMessage("Please fill all the fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false){
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(response.ok){
        navigate("/sign-in")
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left side */}
        <div className="flex-1">
        <Link to="/" className='text-4xl font-bold'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Tanu's</span>
            Blog
        </Link>
        <p className='text-sm mt-5'>This is my blog, welcome everyone.</p>
        </div>

        {/* right side */}
        <div className="flex-1">
          <div className="">
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div className="">
                <Label htmlFor='username'>Your username</Label>
                <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}/>
              </div>
              <div className="">
                <Label>Your email</Label>
                <TextInput type='email' placeholder='abc@gmail.com' id='email' onChange={handleChange}/>
              </div>
              <div className="">
                <Label>Your password</Label>
                <TextInput type='password' placeholder='*********' id='password' onChange={handleChange}/>
              </div>
              <Button type='submit' className='bg-gradient-to-r from-purple-500 to-pink-500' disabled={loading}>
                {
                  loading ? 
                  (<><Spinner size= "sm"/>
                    <span className='pl-3'>Loading ...</span>
                  </>
                  ) 
                  : "Sign up"
                }
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-5" >
              <span>Have an Account?</span>
              <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
            </div>
            {
              errorMessage && (
                <Alert className='mt-5' color="failure">{errorMessage}</Alert>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
