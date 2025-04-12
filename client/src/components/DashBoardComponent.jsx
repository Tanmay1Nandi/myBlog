import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { HiOutlineUserGroup, HiArrowNarrowUp, HiAnnotation, HiDocumentText } from "react-icons/hi"
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashBoardComponent() {

    const {currentUser} = useSelector(state => state.user);

    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    useEffect(()=>{
        const fetchUsers = async() => {
            try {
                const response = await fetch(`/api/user/getusers?limit=5`);
                const data = await response.json();
                if(response.ok){
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchPosts = async() => {
            try {
                const response = await fetch(`/api/post/getposts?limit=5`);
                const data = await response.json();
                if(response.ok){
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        const fetchComments = async() => {
            try {
                const response = await fetch('/api/comment/getcomments?limit=5');
                const data = await response.json();
                if(response.ok){
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        if(currentUser.isAdmin){
            fetchUsers();
            fetchComments();
            fetchPosts();
        }
    },[currentUser])
  return (
    <div className='p-3 md:mx-auto'>
        <div className='flex flex-wrap gap-4 justify-center'>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                        <p className='text-2xl'>{totalUsers}</p>
                    </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
                </div>
                    <div className="flex gap-2 text-sm">
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className='text-gray-500'>Last Month</div>
                    </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
                        <p className='text-2xl'>{totalComments}</p>
                    </div>
                        <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg'/>
                </div>
                    <div className="flex gap-2 text-sm">
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className='text-gray-500'>Last Month</div>
                    </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                <div className="flex justify-between">
                    <div className="">
                        <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                        <p className='text-2xl'>{totalPosts}</p>
                    </div>
                        <HiDocumentText className='bg-pink-500 text-white rounded-full text-5xl p-3 shadow-lg'/>
                </div>
                    <div className="flex gap-2 text-sm">
                        <span className='text-green-500 flex items-center'>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className='text-gray-500'>Last Month</div>
                    </div>
            </div>
        </div>
        <div className='flex flex-wrap mx-auto justify-center py-3 gap-4'>
            <div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800 p-2">
                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className='text-center p-2'>Recent Users</h1>
                    <Button className='bg-gradient-to-r from-purple-500 to-pink-500'><Link to="/dashboard?tab=users">See All</Link></Button>
                </div>
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>User Image</TableHeadCell>
                            <TableHeadCell>Username</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    
                    <TableBody className='divide-y'>  
                            {users && users.map((user) => (                 
                                    <TableRow  key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <TableCell>
                                            <img src={user.profilePicture}
                                            alt='user' className='w-10 h-10 rounded-full bg-gray-500'/>
                                        </TableCell>
                                        <TableCell>
                                            {user.username}
                                        </TableCell>
                                    </TableRow>                                  
                        ))
                            
                        }   
                        </TableBody>         
                </Table>
            </div>
            <div className="flex flex-col w-full md:w-auto shadow-md rounded-md dark:bg-gray-800 p-2">
                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className='text-center p-2'>Recent Comments</h1>
                    <Button className='bg-gradient-to-r from-purple-500 to-pink-500'><Link to="/dashboard?tab=comments">See All</Link></Button>
                </div>
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Comment Content</TableHeadCell>
                            <TableHeadCell>Likes</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className='divide-y'>
                        {comments && comments.map((comment) => (                          
                                <TableRow key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <TableCell className='w-96'>
                                        <p className='line-clamp-2'>{comment.content}</p>
                                    </TableCell>
                                    <TableCell>
                                        {comment.numberofLikes}
                                    </TableCell>
                                </TableRow>
                        ))
                        }
                    </TableBody>                
                </Table>
            </div>
            <div className='dark:bg-gray-800 rounded-md table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-500 dark:scrollbar-track-slate-700
    dark:scrollbar-thumb-slate-500
    '>
                <div className="flex justify-between p-3 text-sm font-semibold">
                    <h1 className='text-center p-2'>Recent Posts</h1>
                    <Button className='bg-gradient-to-r from-purple-500 to-pink-500'><Link to="/dashboard?tab=posts">See All</Link></Button>
                </div>
                <Table hoverable>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Post Image</TableHeadCell>
                            <TableHeadCell>Post Title</TableHeadCell>
                            <TableHeadCell>Category</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className='divide-y'>
                        {posts && posts.map((post) => (                          
                                <TableRow key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <TableCell>
                                        <img src={post.image}
                                        alt='post' className='w-14 h-10 rounded-md bg-gray-500'/>
                                    </TableCell>
                                    <TableCell className='w-96 line-clamp-2'>
                                        {post.title}
                                    </TableCell>
                                    <TableCell className='w-5'>
                                        {post.category}
                                    </TableCell>
                                </TableRow>
                        ))
                        }
                    </TableBody>                
                </Table>
            </div>
        </div>
    </div>
  )
}
