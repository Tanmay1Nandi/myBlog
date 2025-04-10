import { Alert, Button, Textarea, TextInput, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CommentSection({postId}) {
    const {currentUser} = useSelector(state => state.user);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null);

    const [comments, setComments] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [commentToDeleteId, setCommentToDeleteId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await fetch(`/api/comment/getPostComments/${postId}`);
                if(response.ok){
                    const data = await response.json();
                    setComments(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getComments();
    }, [postId])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCommentError(null);
        if(comment.length > 200){
            return;
        }

        try {
            const response = await fetch("/api/comment/create", {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            });
            const data = await response.json();
            if(response.ok){
                setCommentError(null);                
                setComments([data, ...comments]);
                setComment("");
            }
        } catch (error) {
            setCommentError(error.message);
        }       
    }

    const handleLike = async(commentId) => {
        try {
            if(!currentUser){
                navigate("/sign-in");
                return;
            }
            const response = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: "PUT",
            });
            if(response.ok){
                const data = await response.json();
                setComments(comments.map(comment => 
                    comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberofLikes: data.likes.length,
                    } : comment
                ))
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleEdit = async(comment, editedContent) => {
        setComments(
            (comments.map((com) => com._id === comment._id ? 
        {...com, content: editedContent} : com
        ))
        );
    }

    const handleDelete = async(commentId) => {
        setShowModal(false);
        try {
            if(!currentUser){
                navigate("/sign-in");
                return;
            }
            const response = await fetch(`/api/comment/deleteComment/${commentId}`,{
                method: "DELETE"
            })
            if(response.ok){
                const data = await response.json();
                setComments(comments.filter((comment) => comment._id !== commentId));
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='mx-auto max-w-2xl w-full p-3'>
        {
            currentUser ? 
            (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt='User Profile'/>
                    <Link className='text-xs text-cyan-600 hover:underline' to={`/dashboard?tab=profile`}>
                        @{currentUser.username}
                    </Link>
                </div>
            ):
            (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be logged in to comment.
                    <Link className='text-blue-500 hover:underline' to="/sign-in">Sign In</Link>
                </div>
            )
        }
        {
            currentUser && (
                <>
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea placeholder='Add a comment'
                    rows='3' maxLength='200'
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}/>
                    <div className="flex items-center justify-between mt-5">
                        <p className='text-gray-500 text-xs'>{200- comment.length} characters remaining</p>
                        <Button type='submit' className='bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer'>Submit</Button>
                    </div>
                </form>
                {
                    commentError && (<Alert color='failure' className='mt-5'>{commentError}</Alert>)
                }
                {
                    comments.length === 0 ? (
                        <p className='text-sm my-5'>No comments yet.</p>
                    ) : (
                        <>
                            <div className="text-sm my-5 flex items-center gap-1">
                                <p>Comments</p>
                                <div className="border border-gray-400 py-0.5 mt-0.5 px-2 rounded-sm">
                                    <p>{comments.length}</p>
                                </div>
                            </div>
                            {comments.map((comment) => (
                                <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => {
                                    setShowModal(true);
                                    setCommentToDeleteId(commentId);
                                }}/>
                            ))}
                        </>
                    )
                }           
                </>
            )
        }
        <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
            <ModalHeader />
            <ModalBody>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-200' />
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
                    <div className="flex flex-row gap-4 justify-center">
                        <Button className='bg-red-600 hover:bg-red-700' onClick={() => handleDelete(commentToDeleteId)}>Yes I am sure</Button>
                        <Button className='bg-gray-500 hover:bg-gray-600' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    </div>
  )
}
