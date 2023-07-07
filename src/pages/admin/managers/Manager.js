import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllManagers } from '../../../features/managers/managerSlice';
import { swalCheck, swalDeleteMsg } from '../../../components/swal/Swal';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { managerService } from '../../../features/managers/managerService';
import Meta from '../../../utils/Meta';
import { Link } from 'react-router-dom';
import { BsPersonSquare } from 'react-icons/bs';
import { S3_URL } from '../../../utils/apiConfig';
import Table from 'react-bootstrap/esm/Table';
import ReactPaginate from 'react-paginate';

const Manager = () => {

    const dispatch = useDispatch();
    const managerState = useSelector((state) => state.manager);

    useEffect(() => {
      dispatch(getAllManagers({ page: 1, limit: 5 }));
    }, [dispatch]);

    const handleManagerDelete = async (userId) => {
      const result = await swalCheck("Manager");
  
      if(result.isConfirmed) {
        try {
          const results = await managerService.softDeleteManagerById(userId);
          if(results.status){
            dispatch(getAllManagers({ page: 1, limit: 5 }));
            swalDeleteMsg("Manager");
          }
        } catch (e) {
          // console.log("results");
          const results = apiErrorHandler(e);
          // console.log(results);
          toast.warn(results.message);
        }
      }
    }

    const handlePageClick = (e) => {
      let page = e.selected + 1;
      let data = {
        page,
        limit: 5
      }
      dispatch(getAllManagers(data));
    }

    let pageCount = Math.ceil(managerState.count / 5);


  return (
    <>
      <Meta title="Manager" />
      <div className="box-wrapper">
        <div className="d-flex justify-content-between align-items-center px-3">
          <h2>Managers</h2>
          <Link to="new" className="btn btn-primary btn-sm">
            Add Manager
          </Link>
        </div>

        <Table
          striped
          bordered
          variant="dark"
          hover
          responsive
          className="mt-2"
        >
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
            {managerState.managers
              ? managerState.managers.map((user) => {
                  // console.log(user.city.city_name)
                  return (
                    <tr key={user.id}>
                      <td>{user.manager_id}</td>
                      <td align="center">
                        <div className="avatar">
                          {user.manager_avatar ? (
                            <img
                              src={`${S3_URL}${user.manager_avatar}`}
                              className="img-fluid"
                              alt="avatar"
                            />
                          ) : (
                            <BsPersonSquare className="fs-2" />
                          )}
                        </div>
                      </td>
                      <td>
                        {user.manager_first_name ? (
                          user.manager_first_name
                        ) : (
                          <div className="badge text-bg-info rounded-pill">
                            No Name
                          </div>
                        )}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      {/* <td>{user.role}</td> */}
                      <td>
                        {user.city ? (
                          user.city.city_name
                        ) : (
                          <div className="badge text-bg-info rounded-pill">
                            No City
                          </div>
                        )}
                      </td>
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
                        <Link
                          to={`edit/${user.id}`}
                          className="btn btn-primary btn-sm mx-2"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm mx-2"
                          onClick={() => handleManagerDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
        {!managerState.managers && (
          <span className="text-center text-dark">
            {managerState.message}!!..
          </span>
        )}
        {pageCount > 1 && (
          <ReactPaginate
            pageCount={pageCount}
            previousLabel="<<"
            nextLabel=">>"
            breakLabel="..."
            marginPagesDisplayed={1}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        )}
      </div>
    </>
  );
}

export default Manager