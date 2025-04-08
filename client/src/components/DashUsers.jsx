import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader } from "flowbite-react"
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {FaCheck, FaTimes} from "react-icons/fa"

export default function DashUsers() {
  const {currentUser} = useSelector(state => state.user);
  const [users, setUsers] = useState([]);

  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/user/getusers`)
        const data = await response.json();
        if(response.ok){
          setUsers(data.users);
          if(data.users.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if(currentUser.isAdmin) fetchUsers();
  },[currentUser._id]);

  const handleShowMore = async() => {
    const startIndex = users.length;
    try {
      const response = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
      const data = await response.json();
      if(response.ok){
        setUsers((prev) => [...prev, ...data.users]);
        if(data.users.length < 9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

  const handleDeleteUser = async() => {
    setShowModal(false);
    try {
        const response = await fetch(`/api/user/adminDelete/${userIdToDelete}`, {
            method: "DELETE",
        });
        const data = await response.json();
        if(response.ok){
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
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
      {currentUser.isAdmin && users.length > 0 ?
      (
        <>
        <Table hoverable className='shadow-md'>
          <TableHead>
            <TableRow>
              <TableHeadCell>Date Created</TableHeadCell>
              <TableHeadCell>User Image</TableHeadCell>
              <TableHeadCell>User Name</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Admin</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableRow>
          </TableHead>
          
          
            <TableBody className='divide-y'>
            {users.map((user) => (             
                <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800' key={user._id}>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <img src={user.profilePicture} alt={user.username} 
                    className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                  </TableCell>
                  <TableCell>
                      {user.username}
                  </TableCell>
                  <TableCell>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}
                  </TableCell>
                  <TableCell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'
                    onClick={() => {
                      setShowModal(true);
                      setUserIdToDelete(user._id);
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
       <p>Unauthorized</p>
       </>}
       <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
          <ModalHeader />
          <ModalBody>
              <div className="text-center">
                  <HiOutlineExclamationCircle className='h-14 w-14 mx-auto mb-4 text-gray-400 dark:text-gray-200' />
                  <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
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
