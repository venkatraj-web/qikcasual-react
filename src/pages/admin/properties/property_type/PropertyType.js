import React, { useEffect } from 'react'
import Meta from '../../../../utils/Meta'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import { useDispatch, useSelector } from 'react-redux'
import { swalCheck, swalDeleteMsg } from '../../../../components/swal/Swal'
import { apiErrorHandler } from '../../../../utils/apiErrorHandler'
import { toast } from 'react-toastify'
import { propertyTypeService } from '../../../../features/propertyType/propertyTypeService'
import { getAllPropertyTypes } from '../../../../features/propertyType/propertyTypeSlice'
import ReactPaginate from 'react-paginate'

const PropertyType = () => {

    const dispatch = useDispatch();
    const propertyTypeState = useSelector((state) => state.propertyType);

    useEffect(() => {
        dispatch(getAllPropertyTypes({ page: 1, limit: 5 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeletePropertyType = async (typeId) => {
        const result = await swalCheck("property-type");
        if(result.isConfirmed){
            try {
                const results = await propertyTypeService.deletePropertyTypeById(typeId);
                if(results.status){
                  dispatch(getAllPropertyTypes({ page: 1, limit: 5 }));
                  swalDeleteMsg("property-type");
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
      dispatch(getAllPropertyTypes(data));
    }
  
    let pageCount = Math.ceil(propertyTypeState.count / 5);
    
  return (
    <>
        <Meta title="PropertyType" />
    <div className="d-flex align-items-center justify-content-between px-3">
      <h3>Property Type</h3>
      <Link to={"new"} className='btn btn-primary'>Add PropertyType</Link>
    </div>

    <Table className='mt-2' responsive="xl" striped hover size bordered variant='dark' >
        <thead>
            <tr>
                <th>Property Type</th>
                <th>Active</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            { propertyTypeState.propertyTypes ? propertyTypeState.propertyTypes.map((propertyType) => {
                return (
                    <tr key={propertyType.id}>
                        <td>{propertyType.property_type}</td>
                  <td>
                    {propertyType.status ? (
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
                            <Link to={`edit/${propertyType.id}`} className='btn btn-primary btn-sm'>Edit</Link>
                            <button onClick={() => handleDeletePropertyType(propertyType.id)} className='btn btn-danger btn-sm ms-3'>Delete</button>
                        </td>
                    </tr>
                );
            }) : null}
        </tbody>
    </Table>
          {
            !propertyTypeState.propertyTypes && <span className='text-center text-dark'>{propertyTypeState.message}!!..</span>
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

export default PropertyType