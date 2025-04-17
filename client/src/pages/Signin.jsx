import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

//using Redux tool-kit
import { signInStart, signInSuccess, signInFailure, signInRefresh } from '../app/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function Signin() {
  // const[errorMessage, setErrorMessage] = useState(null);
  // const[loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});

  useEffect(() => {dispatch(signInRefresh())}, [])

  //Redux
  const {loading, error: errorMessage} = useSelector(state => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password){
      // return setErrorMessage("Please fill all the fields.");
      return dispatch(signInFailure("Please fill all the fields."))
    }
    try {
      // setLoading(true);
      // setErrorMessage(null);

      //Using Redux toolkit
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false){
        // setLoading(false);
        // return setErrorMessage(data.message);

        //Redux
        return dispatch(signInFailure(data.message));
      }
      // setLoading(false);
      if(response.ok){
        //Redux
        dispatch(signInSuccess(data));

        navigate("/")
      }
    } catch (error) {
      // setErrorMessage(error.message);
      // setLoading(false);

      //Redux
      dispatch(signInFailure(error.message));
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
        <p className='text-sm mt-5'>This is my blog, welcome everyone.You can sign in with your email and password or with google.</p>
        </div>

        {/* right side */}
        <div className="flex-1">
          <div className="">
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <div className="">
                <Label>Your email</Label>
                <TextInput type='email' placeholder='abc@gmail.com' id='email' onChange={handleChange}/>
              </div>
              <div className="">
                <Label>Your password</Label>
                <TextInput type='password' placeholder='**********' id='password' onChange={handleChange}/>
              </div>
              <Button type='submit' className='bg-gradient-to-r from-purple-500 to-pink-500' disabled={loading}>
                {
                  loading ? 
                  (<><Spinner size= "sm"/>
                    <span className='pl-3'>Loading ...</span>
                  </>
                  ) 
                  : "Sign in"
                }
              </Button>
              <OAuth />
            </form>
            <div className="flex gap-2 text-sm mt-5" >
              <span>Don't have an Account?</span>
              <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
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