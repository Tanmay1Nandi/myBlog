import { Alert, Button, FileInput, Modal, ModalBody, ModalHeader, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from "react-redux"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {IoIosCamera} from "react-icons/io"
import {HiOutlineExclamationCircle} from "react-icons/hi"
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../app/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashProfile() {
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false);
    const {currentUser, error, loading} = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
    const [imageFileUploadingError, setImageFileUploadingError] = useState(null);

    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null); 
    const [updateUserError, setUpdateUserError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);

    const [showModal, setShowModal] = useState(false);

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
        setImageFileUploading(true);
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
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUrl(downloadUrl);
                    setFormData({...formData, profilePicture: downloadUrl});
                    setImageFileUploading(false);
                })
            }
        )
    }

    useEffect(() => {
        if(imageFile){
            uploadImage();
        }
    }, [imageFile])

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    }

    const handleSubmit =async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if(Object.keys(formData).length === 0){
            setUpdateUserError("No changes made.");
            return;
        }
        if(imageFileUploading){
            setUpdateUserError("Please wait for the image to upload.");
            return;
        }
        try {
            dispatch(updateStart());
            const response = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json();
            if(!response.ok){
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            }else{
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successfully.")
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
        setImageFileUploadingProgress(null);
    }

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const response = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            }
            );
            const data = await response.json();
            if(!response.ok){
                dispatch(deleteUserFailure());
            }else{
                dispatch(deleteUserSuccess())
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }

    const handleSignout = async () => {
        try {
            const response = await fetch("/api/user/signout", {
                method: "POST",
            })
            const data = await response.json();
            if(!response.ok){
                console.log(data.message);
            }
            else{
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl '>Profile</h1>
        <form className='flex flex-col gap-4 font-semibold dark:font-normal' onSubmit={handleSubmit}>
            <FileInput accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden></FileInput>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                {imageFileUploadingProgress && imageFileUploadingProgress != 100 && (
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
            {edit && <div className='opacity-0 sm:opacity-100 flex flex-row ml-49.5 sm:ml-51 mt-21 bg- absolute '><IoIosCamera className='mt-1'/>&nbsp; {imageFileUploadingProgress == 100 ? <span className='opacity-100 font-semibold text-white cursor-pointer'>Update</span> : <span className='opacity-60 cursor-pointer'>Change</span>}</div>}
            {imageFileUploadingError && <Alert color='failure'>{imageFileUploadingError}</Alert> }
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
            <TextInput type='text' id='email' placeholder='abc@gmail.com' defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type='text' id='password' placeholder='password' onChange={handleChange}/>
            <Button type='submit' outline className='border-2' disabled={loading || imageFileUploading}>{loading ? "Loading..." : "Update"}</Button>
            {
                currentUser && currentUser.isAdmin && (
                    <Link to={"/create-post"}>
                        <Button className='bg-gradient-to-r from-purple-500 to-pink-500 w-full'>Create a post</Button>
                    </Link>
                )
            }
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
            <span className='cursor-pointer' onClick={handleSignout}>Sign out</span>
        </div>
        {updateUserSuccess && <Alert className='mt-3' color='success'>{updateUserSuccess}</Alert>}
        {updateUserError && <Alert className='mt-3' color='failure'>{updateUserError}</Alert>}
        {/* {error && <Alert className='mt-3' color='failure'>{error}</Alert>} */}
        <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
            <ModalHeader />
            <ModalBody>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-200' />
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                    <div className="flex flex-row gap-4 justify-center">
                        <Button className='bg-red-600 hover:bg-red-700' onClick={handleDeleteUser}>Yes I am sure</Button>
                        <Button className='bg-gray-500 hover:bg-gray-600' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
  )
}
