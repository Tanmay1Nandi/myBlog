import React from 'react'
import {Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput} from "flowbite-react"
import { Link, useLocation } from 'react-router-dom'
import {AiOutlineSearch} from "react-icons/ai"
import {FaMoon, FaSun} from "react-icons/fa"
import {useSelector, useDispatch} from "react-redux"
import { toggleTheme } from '../app/theme/themeSlice'
import { signoutSuccess } from '../app/user/userSlice'

export default function Header() {
    const dispatch = useDispatch();
    const path = useLocation().pathname;
    const {currentUser} = useSelector(state => state.user);
    const {theme} = useSelector(state => state.theme);

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
    <Navbar className='border-b-2'>
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Tanu's</span>
            Blog
        </Link>
        <form>
            <TextInput type='text' placeholder='Search...' 
            rightIcon={() => (
                <AiOutlineSearch className="cursor-pointer" />
              )}
              className='hidden lg:inline'
            />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch />
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
                {theme === "light" ? <FaMoon /> : <FaSun />}
                </Button>
            {currentUser ? (
                <Dropdown arrowIcon={false} inline crossOrigin="anonymous" 
                label = {
                    <Avatar alt="user" img={currentUser.profilePicture} rounded />
                }
                >
                    <DropdownHeader>
                        <span className='block text-sm'>@{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                    </DropdownHeader>
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
                <Link to='/'>Home</Link>
            </NavbarLink>
            <NavbarLink active={path === "/about"} as={"div"}>
                <Link to='/about'>About</Link>
            </NavbarLink>
            <NavbarLink active={path === "/projects"} as={"div"}>
                <Link to='/projects'>Projects</Link>
            </NavbarLink>
        </NavbarCollapse>
    </Navbar>
  )
}
