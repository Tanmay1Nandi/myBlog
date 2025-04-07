import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader } from "flowbite-react"
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const {currentUser} = useSelector(state => state.user);
  const [userPosts, setUserPosts] = useState([]);

  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await response.json();
        if(response.ok){
          setUserPosts(data.posts);
          if(data.posts.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if(currentUser.isAdmin) fetchPosts();
  },[currentUser._id]);

  const handleShowMore = async() => {
    const startIndex = userPosts.length;
    try {
      const response = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await response.json();
      if(response.ok){
        setUserPosts((prev) => [...prev, ...data.posts]);
        if(data.posts.length < 9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

  const handleDeletePost = async() => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: "DELETE",
      });
      console.log(response);
      const data = await response.json();
      if(!response.ok){
        console.log(data.message);
      }else{
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-500 dark:scrollbar-track-slate-700
    dark:scrollbar-thumb-slate-500
    '>
      {currentUser.isAdmin && userPosts.length > 0 ?
      (
        <>
        <Table hoverable className='shadow-md'>
          <TableHead>
            <TableRow>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Post Image</TableHeadCell>
              <TableHeadCell>Post Title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell><span>Edit</span></TableHeadCell>
            </TableRow>
          </TableHead>
          
          
            <TableBody className='divide-y'>
            {userPosts.map((post) => (             
                <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800' key={post._id}>
                  <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                    <img src={post.image} alt={post.title} 
                    className='w-20 h-10 object-cover bg-gray-500' />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {post.category}
                  </TableCell>
                  <TableCell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'
                    onClick={() => {
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }}>
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/update-post/${post._id}`}>
                    <span className='font-medium text-blue-500 hover:underline'>Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
            ))}            
            </TableBody>
        </Table>
        {
          showMore && (
            <button className='w-full text-teal-500 self-center text-sm py-7 cursor-pointer font-semibold underline' onClick={handleShowMore}>Show More</button>
          )
        }
        </>
      )
       : <>
       <p>You don't have any post.</p>
       <p className='my-2'>Wait for 10 seconds before clicking the button, if you have a slow internet connection.</p>
       {currentUser.isAdmin && <Link to="/create-post"><Button className='mt-2 bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer'>Create Post</Button></Link>}
       </>}
       <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
          <ModalHeader />
          <ModalBody>
              <div className="text-center">
                  <HiOutlineExclamationCircle className='h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-200' />
                  <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
                  <div className="flex flex-row gap-4 justify-center">
                      <Button className='bg-red-600 hover:bg-red-700' onClick={handleDeletePost}>Yes I am sure</Button>
                      <Button className='bg-gray-500 hover:bg-gray-600' onClick={() => setShowModal(false)}>No, cancel</Button>
                  </div>
              </div>
          </ModalBody>
        </Modal>
    </div>
  )
}
