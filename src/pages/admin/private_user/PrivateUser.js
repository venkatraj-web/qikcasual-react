import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import Table from 'react-bootstrap/esm/Table'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPrivateUsersByRole } from '../../../features/privateUser/privateUserSlice'
import { swalCheck, swalDeleteMsg } from '../../../components/swal/Swal'
import { apiErrorHandler } from '../../../utils/apiErrorHandler'
import { toast } from 'react-toastify'
import { S3_URL } from '../../../utils/apiConfig'
import { BsPersonSquare } from 'react-icons/bs'
import { privatUserService } from '../../../features/privateUser/privateUserService'
import ReactPaginate from 'react-paginate'
import { getRolesByAuthRole } from '../../../utils/auth'

const PrivateUser = () => {

  const dispatch = useDispatch();
  const privateUserState = useSelector((state) => state.privateUser);
  const adminAuthState = useSelector((state) => state.adminAuth);

  const [selectedRole, setSelectedRole] = useState("");
  let roles = [];

  // if(privateUserState.user){
  //   console.log(privateUserState.user.private_users[0].city.city_name)
  // }
  if(adminAuthState.user && adminAuthState.user.private_user){
    roles = getRolesByAuthRole(adminAuthState.user.private_user.role);
  }
  let firstRole = roles[0] && roles[0].id;
  // console.log(firstRole);

  useEffect(() => {
    // dispatch(getPrivateUsers());
    firstRole && dispatch(getPrivateUsersByRole({ role: firstRole, page: 1, limit: 1 }));
    firstRole && setSelectedRole(roles[0].name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstRole]);

  const handlePrivateUserDelete = async (userData) => {
    const result = await swalCheck("PrivateUser");

    if(result.isConfirmed) {
      try {
        const results = await privatUserService.softDeletePrivateUser(userData.id);
        if(results.status){
          // dispatch(getPrivateUsers());
          dispatch(getPrivateUsersByRole({ role: userData.role, page: 1, limit: 1 }));
          swalDeleteMsg("PrivateUser");
        }
      } catch (e) {
        // console.log("results");
        const results = apiErrorHandler(e);
        // console.log(results);
        toast.warn(results.message);
      }
    }
  }

  const getRoles = (role) => {
    setSelectedRole(role.name);
    let data = {
      role:role.id,
      page: 1,
      limit: 1
    }
    // console.log(data);
    dispatch(getPrivateUsersByRole(data));
  }
  const handlePageClick = (e) => {
    let page = e.selected + 1;
    let data = {
      role: selectedRole,
      page,
      limit: 1
    }
    dispatch(getPrivateUsersByRole(data));
  }

  let pageCount = Math.ceil(privateUserState.count / 5);

  return (
    <>
      <Meta title="PrivateUser" />
      <div className="box-wrapper">
        <div className="d-flex justify-content-space gap-10 align-items-center px-3 mt-3">
          { roles.length > 0 ? roles.map((role) => {
            return <span key={role.id} onClick={(e) => getRoles(role)} className='btn btn-primary btn-sm'>{role.name}</span>
          }): null}
        </div>
        <div className="d-flex justify-content-between align-items-center px-3 mt-4">
          <h2>{selectedRole}</h2>
          <Link to="new" className='btn btn-primary btn-sm'>Add PrivateUser</Link>
        </div>
        <Table striped bordered variant='dark' hover responsive className='mt-2'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>City</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {privateUserState.user ? privateUserState.user && privateUserState.user.private_users.map((user) => {
              // console.log(user.city.city_name)
              return (
                <tr key={user.id}>
                  <td>{user.private_user_id}</td>
                  <td align='center'>
                    <div className="avatar">
                      {user.private_user_avatar ? (
                        <img
                        src={`${S3_URL}${user.private_user_avatar}`}
                        className="img-fluid"
                        alt="avatar"
                      />
                      ) : <BsPersonSquare className='fs-2'/>}
                      
                    </div>
                  </td>
                  <td>{user.user_first_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  {/* <td>{user.role}</td> */}
                  <td>{user.city ? user.city.city_name : (
                    <div className="badge text-bg-info rounded-pill">No City</div>
                  )}</td>
                  <td>
                    {user.active ? (
                      <span className="badge text-bg-success rounded-pill">
                        Active
                      </span>
                    ) : (
                      <span className="badge text-bg-info rounded-pill ">
                        Deactive
                      </span>
                    )}
                  </td>
                  <td>
                    <Link to={`edit/${user.id}`} className="btn btn-primary btn-sm mx-2">
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => handlePrivateUserDelete(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            }) : null}
          </tbody>
        </Table>
          {
            !privateUserState.user && <span className='text-center text-dark'>{selectedRole} - {privateUserState.message}!!..</span>
          }
          { pageCount > 1 && <ReactPaginate
            pageCount={pageCount}
            previousLabel="<<"
            nextLabel=">>"
            breakLabel="..."
            marginPagesDisplayed={1}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            containerClassName={'pagination justify-content-center'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}
          /> }
      </div>
    </>
  )
}

export default PrivateUser