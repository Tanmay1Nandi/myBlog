import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInSuccess } from '../app/user/userSlice'

export default function OAuth() {  
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt: "select_account"})
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            const response = await fetch('/api/auth/google', {
                method: "POST",
                headers: {'Content-Type' : "application/json"},
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL,
                })
            })
            const data = await response.json();
            if(response.ok){
                dispatch(signInSuccess(data));
                navigate("/");
            }

        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Button type='button' className='bg-gradient-to-r from-pink-500 to-orange-500' outline onClick={handleGoogleClick}>
        <span className='flex' style={{color: "white"}}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2' />
        Continue with Google
        </span>
    </Button>
  )
}
