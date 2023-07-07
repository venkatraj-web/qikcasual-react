import React, { useEffect } from 'react'
import Meta from '../../../utils/Meta'
import Table from 'react-bootstrap/Table'
import { useDispatch, useSelector } from 'react-redux'
import { getCasuals } from '../../../features/casuals/casualsSlice'
import { Link } from 'react-router-dom';
import { swalCheck, swalDeleteMsg } from '../../../components/swal/Swal'
import { apiErrorHandler } from '../../../utils/apiErrorHandler'
import { toast } from 'react-toastify'
import { casualService } from '../../../features/casuals/casualService'
import { S3_URL } from '../../../utils/apiConfig'
import { BsPersonSquare } from 'react-icons/bs'
import ReactPaginate from 'react-paginate';

const Casuals = () => {

  const dispatch = useDispatch();
  const casualsState = useSelector((state) => state.casuals);

  useEffect(() => {
    dispatch(getCasuals({ page: 1, limit: 5 }));
  }, [dispatch]);

  const casualsData = casualsState.user && casualsState.user.casuals;

  const handleCityDelete = async (userId) => {

    const result = await swalCheck('casual');
    if (result.isConfirmed) {
      try{
        const results = await casualService.softDeleteCasualById(userId);
        if(results.status){
          dispatch(getCasuals({ page: 1, limit: 5 }));
          swalDeleteMsg("Casual");
        }
      } catch (err) {
        const results = apiErrorHandler(err);
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
    dispatch(getCasuals(data));
  }

  let pageCount = Math.ceil(casualsState.count / 5);

  return (
    <>
      <Meta title="Casuals" />
      <div className="box-wrapper">
        <div className="px-3 d-flex align-items-center justify-content-between">
          <h2>Casuals</h2>
          <Link to={"new"} className="btn btn-primary btn-sm">
            Add Casuals
          </Link>
        </div>
        <Table
          striped
          bordered
          variant="dark"
          hover
          size="sm"
          responsive
          className="mt-2"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Avatar</th>
              <th>Email</th>
              <th>PhoneNo</th>
              <th>City</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {casualsData ?
              casualsData.map((casual) => (
                <tr key={casual.id}>
                  <td>{casual.casual_id}</td>
                  <td>{casual.casual_first_name}</td>
                  <td align="center">
                    <div className="avatar">
                      {casual.casual_avatar ? (
                        <img
                          src={`${S3_URL + casual.casual_avatar}`}
                          alt="casual_avatar"
                          className="img-fluid"
                        />
                      ) : (
                        <BsPersonSquare className="fs-2" />
                      )}
                    </div>
                  </td>
                  <td>{casual.email}</td>
                  <td>{casual.casual_phone_no}</td>
                  <td>
                    {casual.city ? (
                      casual.city.city_name
                    ) : (
                      <div className="badge text-bg-info">No City</div>
                    )}
                  </td>
                  <td>
                    {casual.active ? (
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
                      to={`edit/${casual.id}`}
                      className="btn btn-primary btn-sm mx-1"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm mx-1"
                      onClick={() => handleCityDelete(casual.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : null}
          </tbody>
        </Table>
          {
            !casualsData && <span className='text-center text-dark'>{casualsState.message}!!..</span>
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
  );
}

export default Casuals