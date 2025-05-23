import React from 'react'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import About from "./pages/About"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Header from './components/Header'
import FooterComponent from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element= {<About />} />
        <Route path='/sign-in' element= {<Signin />} />
        <Route path='/sign-up' element= {<Signup />} />
        <Route path='/search' element= {<Search />} />
        <Route path='/projects' element= {<Projects />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element= {<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element= {<CreatePost />} />
          <Route path='/update-post/:postId' element= {<UpdatePost />} />
        </Route>

        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  )
}
