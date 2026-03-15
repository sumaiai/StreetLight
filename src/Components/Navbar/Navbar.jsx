import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const Navbar = () => {
    return (
        <div className="navbar bg-[#000814] text-white font-semibold shadow-lg relative">

            {/* Left side — logo + streetlight text */}
            <div className="navbar-start">
                <img src={Logo} alt="logo" className="w-10 h-10 rounded-full" />
                <Link to="/" className="btn btn-ghost text-xl font-bold">StreetLight</Link>
            </div>

            {/* Absolutely centered links for large screens */}
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 gap-1">
                <Link to="/home" className="btn btn-ghost btn-sm">Home</Link>
                <Link to="/post-request" className="btn btn-ghost btn-sm">Post Request</Link>
                <Link to="/my-requests" className="btn btn-ghost btn-sm">My Requests</Link>
                <Link to="/my-helps" className="btn btn-ghost btn-sm">My Helps</Link>
                <Link to="/search" className="btn btn-ghost btn-sm">Find People</Link>
                <Link to="/friends" className="btn btn-ghost btn-sm">Friends</Link>
            </div>

            {/* Right side — dropdown for small screens only */}
            <div className="navbar-end lg:hidden">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-50 mt-3 w-52 p-2 shadow">
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/post-request"> Post Request</Link></li>
                        <li><Link to="/my-requests">My Requests</Link></li>
                        <li><Link to="/my-helps">My Helps</Link></li>
                        <li><Link to="/search">Find People</Link></li>
                        <li><Link to="/friends">Friends</Link></li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default Navbar;