import React, { useEffect } from 'react'
import Meta from '../../../../utils/Meta';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllJobTypes } from '../../../../features/jobType/jobTypeSlice';
import { swalCheck, swalDeleteMsg } from '../../../../components/swal/Swal';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { jobTypeService } from '../../../../features/jobType/jobTypeService';
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';

const JobType = () => {

    const dispatch = useDispatch();
    const jobTypeState = useSelector((state) => state.jobType);

    useEffect(() => {
        dispatch(getAllJobTypes({ page: 1, limit: 5 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteJobType = async (typeId) => {
        const result = await swalCheck("job-type");
        if(result.isConfirmed){
            try {
                const results = await jobTypeService.softDeleteJobTypeById(typeId);
                if(results.status){
                  dispatch(getAllJobTypes({ page: 1, limit: 5 }));
                  swalDeleteMsg("job-type");
                }
            } catch (err) {
                const results = apiErrorHandler(err);
                // console.log(results);
                toast.warning(results.message);
            }
        }
    }

    const handlePageClick = (e) => {
      let page = e.selected + 1;
      let data = {
        page,
        limit: 5
      }
      dispatch(getAllJobTypes(data));
    }
  
    let pageCount = Math.ceil(jobTypeState.count / 5);

  return (
    <>
      <Meta title="JobType" />
      <div className="d-flex align-items-center justify-content-between px-3">
        <h3>JobType</h3>
        <Link to={"new"} className="btn btn-primary">
          Add JobType
        </Link>
      </div>

<Table className='mt-2' responsive="xl" striped hover size bordered variant='dark' >
    <thead>
        <tr>
            <th>Job Type</th>
            <th>Statuc</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        { jobTypeState.jobTypes ? jobTypeState.jobTypes.map((jobType) => {
            return (
                <tr key={jobType.id}>
                    <td>{jobType.jobType}</td>
                    <td>{jobType.status ? (
                        <span className='badge text-bg-success rounded-pill'>Active</span>
                    ):(
                        <span className='badge text-bg-info rounded-pill'>Deactive</span>
                    )}</td>
                    <td>
                        <Link to={`edit/${jobType.id}`} className='btn btn-primary btn-sm'>Edit</Link>
                        <button onClick={() => handleDeleteJobType(jobType.id)} className='btn btn-danger btn-sm ms-3'>Delete</button>
                    </td>
                </tr>
            );
        }) : null}
    </tbody>
</Table>
          {
            !jobTypeState.jobTypes && <span className='text-center text-dark'>{jobTypeState.message}!!..</span>
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


    </>
  );
}

export default JobType