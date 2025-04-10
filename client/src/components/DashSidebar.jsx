import {Sidebar, SidebarItem, SidebarItemGroup, SidebarItems} from "flowbite-react"
import { HiArrowSmRight, HiUser, HiDocumentText, HiOutlineUser, HiAnnotation, HiChartPie } from "react-icons/hi"
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom"
import { signoutSuccess } from "../app/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
    const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabForUrl = urlParams.get("tab");
    if(tabForUrl){
      setTab(tabForUrl);
    }
  },[location.search])

  const {currentUser} = useSelector(state => state.user);

  const dispatch = useDispatch();
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
        <Sidebar className="w-full md:w-56">
            <SidebarItems>
                <SidebarItemGroup className="md:min-h-screen flex flex-col gap-0.5">
                    {
                        currentUser && currentUser.isAdmin && (
                            <Link to={"/dashboard?tab=dashboard"}>
                                <SidebarItem active={tab === "dashboard" || !tab} icon={HiChartPie} as='div'>
                                    Dashboard
                                </SidebarItem>
                            </Link>
                        )
                    }
                    <Link to="/dashboard?tab=profile">
                        <SidebarItem active={tab === "profile"} icon={HiUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor='dark' as='div'>
                            Profile
                        </SidebarItem>
                    </Link>
                    {currentUser.isAdmin &&
                    <Link to="/dashboard?tab=posts">
                        <SidebarItem active={tab === "posts"} icon={HiDocumentText} as='div'>
                            Posts
                        </SidebarItem>
                    </Link>
                    }
                    {currentUser.isAdmin &&
                    <Link to="/dashboard?tab=users">
                        <SidebarItem active={tab === "users"} icon={HiOutlineUser} as='div'>
                            Users
                        </SidebarItem>
                    </Link>
                    }

                    {currentUser.isAdmin &&
                    <Link to="/dashboard?tab=comments">
                        <SidebarItem active={tab === "comments"} icon={HiAnnotation} as='div'>
                            Comments
                        </SidebarItem>
                    </Link>
                    }
                    
                    <SidebarItem icon={HiArrowSmRight}  labelColor='dark' onClick={handleSignout}>
                        Sign out
                    </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
  )
}
