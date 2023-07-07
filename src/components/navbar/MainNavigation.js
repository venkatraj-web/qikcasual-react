import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavigation.css';

const MainNavigation = () => {
  return (
    <>
        <div className="header-upper">
        <div className="container">
            <nav className='d-flex justify-content-between'>
                <h1 className='text-white mb-0'>Qikcasual</h1>
                <ul className='d-flex align-items-center w-25 mt-3 justify-content-between'>
                    <li><NavLink to={"/"} className="text-white">Home</NavLink></li>
                    <li><NavLink to={"/about"} className="text-white">About</NavLink></li>
                    <li><NavLink to={"/contact"} className="text-white">Contact</NavLink></li>
                </ul>
            </nav>
        </div>
        </div>
    </>
  )
}

export default MainNavigation