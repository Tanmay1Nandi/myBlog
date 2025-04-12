import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import CallToAction from "../components/CallForAction.jsx";
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post/getposts`)
        const data = await response.json();
        if(response.ok){
          setPosts(data.posts);
        }  
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchPosts();
  }, [])

  return (
    <div className=''>
      <div className="flex flex-col gap-5 px-3 p-28 max-w-6xl mx-auto">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs lg:text-sm'>This is my first complete MERN project, its a Blog with many features for users and specially for the admins. I hope you will like this.</p>
      <Link to="/search" className='text-xs sm:text-sm text-teal-500 text-bold hover:underlin'>View all post</Link>
      </div>
      <div className="p-3 bg-blue-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl flex flex-col gap-8 py-3 p-3 sm:p-0 mx-auto sm:w-100 lg:w-full lg:px-3">
        {
          posts && posts.length>0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl mt-5 font-semibold text-center'>Recent Posts</h2>
              <div className="flex flex-wrap gap-3">
                {
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                }
              </div>
              <Link to={"/search"} className='text-lg mb-3 text-teal-500 hover:underline text-center'>
              View all posts
              </Link>
            </div>
          )
        }
      </div>
    </div>
  )
}
