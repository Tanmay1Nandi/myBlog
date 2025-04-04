import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from "react-redux"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {IoIosCamera} from "react-icons/io"

export default function DashProfile() {
    const [edit, setEdit] = useState(false);
    const {currentUser} = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
    const filePickerRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    }

    const handleEdit = () => {
        setEdit(true);
    }
    const handleRemoveEdit = ()=>{
        setEdit(false);
    }

    const uploadImage = async()=>{
        setImageFileUploadingError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadingProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadingError("Count not upload image, (File type should be image, File should be less than 2MB");
                setImageFileUploadingProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUrl(downloadUrl);
                })
            }
        )
    }

    useEffect(() => {
        if(imageFile){
            uploadImage();
        }
    }, [imageFile])

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl '>Profile</h1>
        <form className='flex flex-col gap-4 font-semibold dark:font-normal'>
            <FileInput accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden></FileInput>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                {imageFileUploadingProgress && (
                    <CircularProgressbar value={imageFileUploadingProgress || 0} text={`${imageFileUploadingProgress}%`}
                    strokeWidth={5}
                    styles={{
                        root:{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                        },
                        path:{
                            stroke: `rgb(0,152,0), ${imageFileUploadingProgress/100}`,
                        }
                    }}/>
                )}
                <img src={imageFileUrl || currentUser.profilePicture} alt='user' onMouseOver={handleEdit} onMouseLeave={handleRemoveEdit} className={`rounded-full w-full h-full border-7 border-[lightGray] dark:border-[#5c5858] object-cover ${imageFileUploadingProgress && imageFileUploadingProgress <100 && "opacity-60"}`} />
            </div>
            {edit && <div className='flex flex-row ml-50 '><IoIosCamera className='mt-1'/>&nbsp; <span>Change</span></div>}
            {imageFileUploadingError && <Alert color='failure'>{imageFileUploadingError}</Alert> }
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
            <TextInput type='text' id='email' placeholder='abc@gmail.com' defaultValue={currentUser.email} />
            <TextInput type='text' id='password' placeholder='password' />
            <Button type='submit' outline className='border-2'>Update</Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer'>Sign out</span>
        </div>
    </div>
  )
}
