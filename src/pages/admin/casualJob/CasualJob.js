import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Meta from '../../../utils/Meta'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCasualJobs } from '../../../features/casualJob/casualJobSlice';
import Table from 'react-bootstrap/esm/Table';
import { swalCheck, swalDeleteMsg } from '../../../components/swal/Swal';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { casualJobService } from '../../../features/casualJob/casualJobService';
import ReactPaginate from 'react-paginate';

const CasualJob = () => {

    const dispatch = useDispatch();
    const casualJobState = useSelector((state) => state.casualJob);

    useEffect(() => {
      dispatch(getAllCasualJobs({ page: 1, limit: 5 }));
    }, [dispatch]);

    const handleCasualJobDelete = async (userId) => {
      const result = await swalCheck("CasualJob");
  
      if(result.isConfirmed) {
        try {
          const results = await casualJobService.softDeleteCasualJobById(userId);
          if(results.status){
            dispatch(getAllCasualJobs({ page: 1, limit: 5 }));
            swalDeleteMsg("CasualJob");
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
      dispatch(getAllCasualJobs(data));
    }
  
    let pageCount = Math.ceil(casualJobState.count / 5);

  return (
    <>
    <Meta title="CasualJob" />
    <div className="box-wrapper">
        <div className="d-flex justify-content-between align-items-center px-3">
          <h2>CasualJobs</h2>
          <Link to="new" className='btn btn-primary btn-sm'>Add CasualJob</Link>
        </div>
        
        <Table striped bordered variant='dark' hover responsive className='mt-2'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Job Title</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>City</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { casualJobState.casualJobs ? casualJobState.casualJobs.map((job) => {
              // console.log(job.city.city_name)
              return (
                <tr key={job.id}>
                  <td>{job.casual_job_id}</td>
                  <td>{job.job_title}</td>
                  <td>{job.start_date}</td>
                  <td>{job.end_date}</td>
                  {/* <td>{job.role}</td> */}
                  <td>{job.city ? job.city.city_name : (
                    <div className="badge text-bg-info rounded-pill">No City</div>
                  )}</td>
                  <td>
                    {job.active ? (
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
                    <Link to={`edit/${job.id}`} className="btn btn-primary btn-sm mx-2">
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => handleCasualJobDelete(job.id)}
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
            !casualJobState.casualJobs && <span className='text-center text-dark'>{casualJobState.message}!!..</span>
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

export default CasualJob