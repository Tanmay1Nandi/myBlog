import {Sidebar, SidebarItem, SidebarItemGroup, SidebarItems} from "flowbite-react"
import { HiArrowSmRight, HiUser } from "react-icons/hi"
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom"
import { signoutSuccess } from "../app/user/userSlice";
import { useDispatch } from "react-redux";

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
    <div>
        <Sidebar className="w-full md:w-56">
            <SidebarItems>
                <SidebarItemGroup className="md:min-h-screen flex flex-col gap-0.5">
                    <Link to="/dashboard?tab=profile">
                        <SidebarItem active={tab === "profile"} icon={HiUser} label={"User"} labelColor='dark' as='div'>
                            Profile
                        </SidebarItem>
                    </Link>
                    <SidebarItem icon={HiArrowSmRight}  labelColor='dark' onClick={handleSignout}>
                        Sign out
                    </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    </div>
  )
}
