import React from 'react'
import { assets } from "../../assets/assets";
import './Navbar.css'
const Navbar = () => {
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      {/* {token && admin ? (
        <p className="login-conditon" onClick={logout}>Logout</p>
      ) : (
        <p className="login-conditon" onClick={()=>navigate("/")}>Login</p>
      )} */}
      <img className="profile" src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar
