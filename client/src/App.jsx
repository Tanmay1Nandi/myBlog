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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element= {<About />} />
        <Route path='/sign-in' element= {<Signin />} />
        <Route path='/sign-up' element= {<Signup />} />
        <Route path='/projects' element= {<Projects />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element= {<Dashboard />} />
        </Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  )
}
