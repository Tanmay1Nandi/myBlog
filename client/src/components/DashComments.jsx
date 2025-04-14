import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader } from "flowbite-react"
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashComments() {
  const {currentUser} = useSelector(state => state.user);
  const [comments, setComments] = useState([]);

  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/getcomments`)
        const data = await response.json();
        if(response.ok){
          setComments(data.comments);
          if(data.comments.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if(currentUser.isAdmin) fetchComments();
  },[currentUser._id]);

  const handleShowMore = async() => {
    const startIndex = comments.length;
    try {
      const response = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`)
      const data = await response.json();
      if(response.ok){
        setComments((prev) => [...prev, ...data.comments]);
        if(data.comments.length < 9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

  const handleDeleteComment = async() => {
    setShowModal(false);
    try {
        const response = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
            method: "DELETE",
        });
        const data = await response.json();
        if(response.ok){
            setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        }else{
            console.log(data.message);
        }
    } catch (error) {
        console.log(error.message);
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-500 dark:scrollbar-track-slate-700
    dark:scrollbar-thumb-slate-500
    '>
      {currentUser.isAdmin && comments.length > 0 ?
      (
        <>
        <Table hoverable className='shadow-md'>
          <TableHead>
            <TableRow>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Comment Content</TableHeadCell>
              <TableHeadCell>Number of likes</TableHeadCell>
              <TableHeadCell>Post Id</TableHeadCell>
              <TableHeadCell>User Id</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableRow>
          </TableHead>
          
          
            <TableBody className='divide-y'>
            {comments.map((comment) => (             
                <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800' key={comment._id}>
                  <TableCell>{new Date(comment.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {comment.content}
                  </TableCell>
                  <TableCell>
                    {comment.numberofLikes}
                  </TableCell>
                  <TableCell>
                    {comment.postId}
                  </TableCell>
                  <TableCell>
                    {comment.userId}
                  </TableCell>
                  <TableCell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'
                    onClick={() => {
                      setShowModal(true);
                      setCommentIdToDelete(comment._id);
                    }}>
                      Delete
                    </span>
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
       <p>Unauthorized or no comment yet.</p>
       </>}
       <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
          <ModalHeader />
          <ModalBody>
              <div className="text-center">
                  <HiOutlineExclamationCircle className='h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-200' />
                  <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
                  <div className="flex flex-row gap-4 justify-center">
                      <Button className='bg-red-600 hover:bg-red-700' onClick={handleDeleteComment}>Yes I am sure</Button>
                      <Button className='bg-gray-500 hover:bg-gray-600' onClick={() => setShowModal(false)}>No, cancel</Button>
                  </div>
              </div>
          </ModalBody>
        </Modal>
    </div>
  )
}
