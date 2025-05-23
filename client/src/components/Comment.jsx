import React, { useEffect, useState } from 'react'
import moment from "moment"
import {FaThumbsUp} from "react-icons/fa"
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({comment, onLike, onEdit, onDelete}) {

    const [user, setUser] = useState({});
    const {currentUser} = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    useEffect(() => {
        const getUser = async()=>{
            try {
                const response = await fetch(`/api/user/${comment.userId}`);
                const data = await response.json();
                if(response.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [comment])

    const handleEdit = async () => {
        setIsEditing(true);
        setEditedContent(comment.content)
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    content: editedContent
                })
            });
            if(response.ok){
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <div className="flex p-4 border-b border-gray-500 dark:border-gray-600 text-sm">
        <div className='flex-shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full object-cover bg-gray-200' src={user.profilePicture} alt={user.username}/>
        </div>
        <div className="flex-1">
            <div className="flex items-center mb-1">
                <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : "anonymous user"}</span>
                <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
            </div>
            {isEditing ? 
            <>
                <Textarea className='mb-2' value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}/>
                <div className="flex justify-end gap-2 text-xs">
                    <Button className='bg-gradient-to-r from-purple-500 to to-blue-500 cursor-pointer' type='button' size='sm' onClick={handleSave}>
                        Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)} className='border-2 cursor-pointer' outline type='button' size='sm'>
                        Cancel
                    </Button>
                </div>
            </>
            : (
                <>
                    <p className='text-gray-500 mb-2'>{comment.content}</p>
                    <div className="flex items-center pt-2 text-xs border-t border-gray-300 dark:border-gray-700 max-w-fill gap-2">
                        <button onClick={() => onLike(comment._id)} type='button' className={`text-gray-400 hover:text-blue-500 ${
                            currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                        }`}><FaThumbsUp className='text-sm' /></button>
                        <p className='text-gray-400'>
                            {
                                comment.numberofLikes > 0 && comment.numberofLikes + " " + (
                                    comment.numberofLikes === 1 ? "like" : "likes"
                                )
                            }
                        </p>
                        {
                            currentUser && (comment.userId === currentUser._id) &&
                            <button type='button' onClick={handleEdit} className='hover:text-blue-500'>Edit</button>
                        }
                        {
                            currentUser && (comment.userId === currentUser._id || currentUser.isAdmin) &&
                            <button type='button' onClick={() => onDelete(comment._id)} className='text-gray-400 hover:text-red-500'>Delete</button>
                        }
                    </div>
                </>
            )}
            
        </div>
    </div>
  )
}
