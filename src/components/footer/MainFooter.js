import React from 'react'
import {BsFacebook, BsYoutube, BsInstagram, BsGithub, BsLinkedin} from 'react-icons/bs';
import { Link } from 'react-router-dom';

const MainFooter = () => {
  return (
    <>
    <footer className='py-4'>
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <h4 className='text-white'>Contact Us</h4>
                    <div>
                        <address className='text-white fs-6'>
                            Hno : 192/10-A Gayathri Lane, <br />
                            Tiruchengode, Namakkal <br />
                            pincode : 637211
                        </address>
                        <a href="tel:+91 9659858301" className='d-block mt-3 mb-2 text-white'>+91 9659858301</a>
                        <a href="mailto:venkat.raj@stratonik.com" className='d-block mt-3 mb-2 text-white'>venkat.raj@stratonik.com</a>
                        <div className='social_icons d-flex align-items-center gap-30 mt-4'>
                            <a href=" " className='text-white'><BsLinkedin className='fs-4' /></a>
                            <a href=" " className='text-white'><BsInstagram className='fs-4' /></a>
                            <a href=" " className='text-white'><BsGithub className='fs-4' /></a>
                            <a href=" " className='text-white'><BsYoutube className='fs-4' /></a>
                            <a href=" " className='text-white'><BsFacebook className='fs-4' /></a>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <h4 className='text-white mb-4'>Information</h4>
                    <div className='footer-links d-flex flex-column'>
                        <Link to="/" className='py-2 mb-1 text-white'>Privacy Policy</Link>
                        <Link to="/" className='py-2 mb-1 text-white'>Refund Policy</Link>
                        <Link to="/" className='py-2 mb-1 text-white'>Shipping Policy</Link>
                        <Link to="/" className='py-2 mb-1 text-white'>Terms & Conditions</Link>
                    </div>
                </div>
                <div className="col-3">
                    <h4 className='text-white mb-4'>Account</h4>
                    <div className='footer-links d-flex flex-column'>
                        <Link to="/admin" className='py-2 mb-1 text-white'>Admin Dashboard</Link>
                        <Link to="/login" className='py-2 mb-1 text-white'>FAQ</Link>
                        <Link to="/admin/login" className='py-2 mb-1 text-white'>Admin Login</Link>
                    </div>
                </div>
                <div className="col-2">
                    <h4 className='text-white mb-4'>Quick Links</h4>
                    <div className="footer-links d-flex flex-column">
                        <Link to="/" className="py-2 mb-1 text-white">Home</Link>
                        <Link to="/about" className="py-2 mb-1 text-white">About</Link>
                        <Link to="/contact" className="py-2 mb-1 text-white">Contact</Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    </>
  )
}

export default MainFooter