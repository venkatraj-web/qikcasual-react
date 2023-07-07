import React, { useEffect } from 'react'
import Meta from '../../../../utils/Meta'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getAllPropertGrades } from '../../../../features/propertyGrade/propertyGradeSlice';
import Table from 'react-bootstrap/Table';
import { swalCheck, swalDeleteMsg } from '../../../../components/swal/Swal';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { propertyGradeService } from '../../../../features/propertyGrade/propertyGradeService';
import ReactPaginate from 'react-paginate';

const PropertyGrade = () => {

    
    const dispatch = useDispatch();
    const propertyGradeState = useSelector((state) => state.propertyGrade);

    useEffect(() => {
        dispatch(getAllPropertGrades({ page: 1, limit: 5 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeletePropertyGrade = async (gradeId) => {
        const result = await swalCheck("property-grade");
        if(result.isConfirmed){
            try {
                const results = await propertyGradeService.deletePropertyGrade(gradeId);
                if(results.status){
                  dispatch(getAllPropertGrades({ page: 1, limit: 5 }));
                  swalDeleteMsg("property-grade");
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
      dispatch(getAllPropertGrades(data));
    }
  
    let pageCount = Math.ceil(propertyGradeState.count / 5);

  return (
    <>
        <Meta title="PropertyGrade" />
    <div className="d-flex align-items-center justify-content-between px-3">
      <h3>Property Grade</h3>
      <Link to={"new"} className='btn btn-primary'>Add PropertyGrade</Link>
    </div>

    <Table className='mt-2' responsive="xl" striped hover size bordered variant='dark' >
        <thead>
            <tr>
                <th>Property Grade</th>
                <th>Property Type</th>
                <th>Active</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            { propertyGradeState.propertyGrades ? propertyGradeState.propertyGrades.map((propertyGrade) => {
                return (
                    <tr key={propertyGrade.id}>
                        <td>{propertyGrade.property_grade}</td>
                        <td>{propertyGrade.property_type ? propertyGrade.property_type.property_type : (
                            <div className="badge text-bg-info rounded-pill">No PropertyType</div>
                        )}</td>
                        <td>
                          {propertyGrade.status ? (
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
                            <Link to={`edit/${propertyGrade.id}`} className='btn btn-primary btn-sm'>Edit</Link>
                            <button onClick={() => handleDeletePropertyGrade(propertyGrade.id)} className='btn btn-danger btn-sm ms-3'>Delete</button>
                        </td>
                    </tr>
                );
            }) : null}
        </tbody>
    </Table>
          {
            !propertyGradeState.propertyGrades && <span className='text-center text-dark'>{propertyGradeState.message}!!..</span>
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
  )
}

export default PropertyGrade