import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Meta from '../../../utils/Meta';
import { getAdminProfile } from '../../../features/admin/auth/adminAuthSlice';
import Container from '../../../utils/Container';
import { S3_URL } from '../../../utils/apiConfig';
import { BsPersonSquare } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const AdminProfile = () => {
  const adminAuthState = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  // console.log('adminAuthState', adminAuthState)
  useEffect(()=>{
    dispatch(getAdminProfile());
  }, [dispatch]);

  const userObj = {
    firstName: "",
    lastName: "",
    userId: "",
    email: "",
    phoneNo: "",
    userAvatar: ""
  }

  const adminData = adminAuthState.user.private_user ? adminAuthState.user.private_user: adminAuthState.user.manager;
  if(adminData){
    userObj.email = adminData.email;
    if(adminAuthState.user.private_user){
      userObj.firstName = adminData.user_first_name;
      userObj.lastName = adminData.user_last_name;
      userObj.phoneNo = adminData.user_phone_no;
      userObj.userId = adminData.private_user_id;
      userObj.userAvatar = adminData.private_user_avatar;
    }
    if(adminAuthState.user.manager){
      userObj.firstName = adminData.manager_first_name;
      userObj.lastName = adminData.manager_last_name;
      userObj.phoneNo = adminData.manager_phone_no;
      userObj.userId = adminData.manager_id;
      userObj.userAvatar = adminData.manager_avatar;
    }
  }
  // console.log(adminData);

  return (
    <>
    <Meta title={"Admin Profile"} />
    <Container class1="py-4 adminProfile home-wrapper-2">
      <div className="d-flex justify-content-between align-items-center p-3">
        <h1>Profile</h1>
        <Link to={"edit"} className='btn btn-primary btn-sm'>Edit Profile</Link>
      </div>
        { !adminData ? (
          <div className="row">
            <div className="col-12">
              <div className="mt-2 d-flex flex-column justify-content-start align-items-center">
                <h3>No Data !!!</h3>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <div className="my-2 d-flex align-items-center justify-content-center">
                <div className="boxImage">
                  { userObj.userAvatar ? (
                    <img src={`${S3_URL+userObj.userAvatar}`} alt="avatar" />
                  ) : (<BsPersonSquare className='fs-1' />)}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="mt-2 d-flex flex-column justify-content-start align-items-center">
                <h5>Id</h5>
                <h6>{userObj.userId ? userObj.userId : "no" }</h6>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="mt-2 d-flex flex-column justify-content-start align-items-center">
                <h5>First Name</h5>
                <h6>{userObj.firstName ? userObj.firstName : "no" }</h6>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="mt-2 d-flex flex-column justify-content-start align-items-center">
                <h5>Last Name</h5>
                <h6>{userObj.lastName ? userObj.lastName : "no" }</h6>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="mt-2 d-flex flex-column justify-content-start align-items-center">
                <h5>Email</h5>
                <h6>{userObj.email}</h6>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="mt-2 d-flex flex-column justify-content-start align-items-center">
                <h5>Phone No</h5>
                <h6>{userObj.phoneNo ? userObj.phoneNo : "no" }</h6>
              </div>
            </div>
          </div>
        )}
        
    </Container>
    </>
  )
}

export default AdminProfile