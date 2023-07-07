import React, { useEffect, useState } from 'react'
import {GiHamburgerMenu} from 'react-icons/gi'
import {CgProfile} from 'react-icons/cg'
import { FiLogOut } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSideBar } from '../../features/adminStyle/adminStyleSlice'
import { getAdminProfile } from '../../features/admin/auth/adminAuthSlice'
import { S3_URL } from '../../utils/apiConfig'

const MainContent = (props) => {

  const [togglePic, setTogglePic] = useState("close");

  const dispatch = useDispatch();
  const adminStyleState = useSelector((state) => state.adminStyle);
  const adminAuthState = useSelector((state) => state.adminAuth);

  useEffect(()=>{
    dispatch(getAdminProfile());
  }, [dispatch]);

  const userObj = {
    firstName: "",
    userId: "",
    email: "",
    userAvatar: ""
  }

  const adminData = adminAuthState.user.private_user ? adminAuthState.user.private_user: adminAuthState.user.manager;
  // adminAuthState.user && console.log(S3_URL+adminData.private_user_avatar)const adminData = adminAuthState.user.private_user ? adminAuthState.user.private_user: adminAuthState.user.manager;
  if(adminData){
    userObj.email = adminData.email;
    if(adminAuthState.user.private_user){
      userObj.firstName = adminData.user_first_name;
      userObj.userId = adminData.private_user_id;
      userObj.userAvatar = adminData.private_user_avatar;
    }
    if(adminAuthState.user.manager){
      userObj.firstName = adminData.manager_first_name;
      userObj.userAvatar = adminData.manager_avatar;
    }
  }

  const toggleSidebar = () => {
    dispatch(toggleSideBar());
  }

  const toggleProfile = () => {
    setTogglePic((state) => {
      return togglePic === "close" ? "open" : "close";
    })
  }

  return (
    <>
      <section className={`dashboard ${adminStyleState.navClose}`}>
        <div className={`top ${adminStyleState.navClose}`}>
          <span className='sidebar-toggle' onClick={toggleSidebar}><GiHamburgerMenu /></span>
          <div className={`profile ${togglePic}`}>
            <div className="image" onClick={toggleProfile}>
              { adminData && userObj.userAvatar ? (
                <img src={`${S3_URL+userObj.userAvatar}`} alt="profile" />
              ) : (
                <img src="/images/profile.jpg" alt="profile" />
              )}
            </div>
            <ul className="sub-menu">
              <li onClick={toggleProfile}>
                <Link to="/admin/profile">
                  <CgProfile />
                  <span className="link-name">Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/login">
                  <FiLogOut />
                  <span className="link-name">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="dash-content">
          {props.children}
        </div>
      </section>
    </>
  )
}

export default MainContent