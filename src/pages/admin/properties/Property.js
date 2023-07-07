import React, { useEffect } from 'react'
import Meta from '../../../utils/Meta'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/esm/Table'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProperties } from '../../../features/property/propertySlice'
import { S3_URL } from '../../../utils/apiConfig'
import { BsPersonSquare } from 'react-icons/bs'
import { swalCheck, swalDeleteMsg } from '../../../components/swal/Swal'
import { propertyService } from '../../../features/property/propertyService'
import { toast } from 'react-toastify'
import { apiErrorHandler } from '../../../utils/apiErrorHandler'
import ReactPaginate from 'react-paginate'

const Property = () => {

    const dispatch = useDispatch();
    const propertyState = useSelector((state) => state.property);

    useEffect(() => {
        dispatch(getAllProperties({ page: 1, limit: 5 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteProperty = async (propertyId) => {
        const result = await swalCheck("property");
        if(result.isConfirmed){
            try {
                const results = await propertyService.deletePropertyById(propertyId);
                if(results.status){
                    dispatch(getAllProperties({ page: 1, limit: 5 }));
                    swalDeleteMsg("property");
                }
            } catch (e) {
                const results = apiErrorHandler(e);
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
      dispatch(getAllProperties(data));
    }
  
    let pageCount = Math.ceil(propertyState.count / 5);

  return (
    <>
    <Meta title="Property" />
    <div className="box-wrapper">
    <div className="d-flex justify-content-between align-items-center x-3">
        <h3>Property</h3>
        <Link to={"new"} className='btn btn-primary btn-sm'>Add Property</Link>
    </div>

    <Table striped hover responsive size bordered variant='dark' className='mt-2'>
        <thead>
            <tr>
                <td>Property Name</td>
                <td>Property Avatar</td>
                <td>Property Type</td>
                <td>Client Name</td>
                <td>City</td>
                <td>Active</td>
                <td>Actions</td>
            </tr>
        </thead>
        <tbody>
            { propertyState.properties ? propertyState.properties.map((property) => {
                return (
                  <tr key={property.id}>
                    <td>{property.property_name}</td>
                    <td align='center'>
                      <div className="avatar">
                        {property.property_avatar ? (
                          <img
                            src={`${S3_URL + property.property_avatar}`}
                            alt="avatar"
                            className="img-fluid"
                          />
                        ) : (
                          <BsPersonSquare className='fs-2' />
                        )}
                      </div>
                    </td>
                    <td>
                      {property.property_type ? (
                        property.property_type.property_type
                      ) : (
                        <div className="badge text-bg-info rounded-pill">
                          No PropertyType
                        </div>
                      )}
                    </td>
                    <td>
                      {property.client ? (
                        property.client.client_name
                      ) : (
                        <div className="badge text-bg-info rounded-pill">No Client</div>
                      )}
                    </td>
                    <td>
                      {property.city ? (
                        property.city.city_name
                      ) : (
                        <div className="badge text-bg-info rounded-pill">No City</div>
                      )}
                    </td>
                    <td>
                      {property.active ? (
                        <div className="badge text-bg-success rounded-pill">Active</div>
                      ) : (
                        <div className="badge text-bg-info rounded-pill">Deactive</div>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`edit/${property.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                      </Link>
                      <button onClick={() => handleDeleteProperty(property.id)} className="btn btn-danger btn-sm ms-3">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
            }) : null}
        </tbody>
    </Table>
          {
            propertyState.isLoading ? <span className='text-center text-dark'>Loading!!..</span> :
            !propertyState.properties && <span className='text-center text-dark'>{propertyState.message}!!..</span>
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

export default Property