import React, { useEffect, useState } from 'react'
import {Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput} from "flowbite-react"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {AiOutlineSearch} from "react-icons/ai"
import {FaMoon, FaSun} from "react-icons/fa"
import {BsBrightnessHigh, BsBrightnessHighFill} from "react-icons/bs"
import {useSelector, useDispatch} from "react-redux"
import { toggleTheme } from '../app/theme/themeSlice'
import { signoutSuccess } from '../app/user/userSlice'

export default function Header() {
    const dispatch = useDispatch();
    const path = useLocation().pathname;
    const {currentUser} = useSelector(state => state.user);
    const {theme} = useSelector(state => state.theme);

    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    },[location.search])

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


    const handleSumbit = async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

  return (
    <Navbar className='border-b-2'>
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Tanu's</span>
            Blog
        </Link>
        <form onSubmit={handleSumbit}>
            <TextInput type='text' placeholder='Search...' 
            rightIcon={() => (
                <AiOutlineSearch className="cursor-pointer" />
              )}
              className='hidden lg:inline'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>
        <Button className='w-12 h-10 lg:hidden' onClick={() => navigate("/search")} color='gray' pill>
            <AiOutlineSearch/>
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='relative w-10 h-10 mt-0.5 mr-2 border-2' outline color='gray' pill onClick={() => dispatch(toggleTheme())}>
                <div className='pl-0.5'>
                {theme === "light" ? <FaMoon /> : <BsBrightnessHighFill />}    
                </div>
                </Button>
            {currentUser ? (
                <Dropdown arrowIcon={false} inline crossOrigin="anonymous" 
                label = {
                    <Avatar className='profile-pic' alt="user" img={currentUser.profilePicture} rounded />
                }
                >
                    <DropdownHeader>
                        <span className='block text-sm'>@{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                    </DropdownHeader>
                    <Link to="/dashboard?tab=dashboard">
                    <DropdownItem>Dashboard</DropdownItem></Link>
                    <DropdownDivider/>
                    <Link to="/dashboard?tab=profile">
                    <DropdownItem>Profile</DropdownItem></Link>
                    <DropdownDivider/>                  
                    <DropdownItem onClick={handleSignout}>Sign out</DropdownItem>
                </Dropdown>
            )
              : 
            <Link to='/sign-in'>
            <Button className='bg-gradient-to-r from-purple-600 to-blue-600'>Sign In</Button>
          </Link>}
            
            <NavbarToggle />
        </div>
        <NavbarCollapse>
            <NavbarLink active={path === "/"} as={"div"}>
                <Link style={{ display: 'block', width: '100%' }} to='/'>Home</Link>
            </NavbarLink>
            <NavbarLink active={path === "/about"} as={"div"}>
                <Link style={{ display: 'block', width: '100%' }} to='/about'>About</Link>
            </NavbarLink>
            <NavbarLink active={path === "/projects"} as={"div"}>
                <Link style={{ display: 'block', width: '100%' }} to='/projects'>Projects</Link>
            </NavbarLink>
        </NavbarCollapse>
    </Navbar>
  )
}
