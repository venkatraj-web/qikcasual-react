import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import { swalCheck, swalDeleteMsg } from '../../../../components/swal/Swal';
import { useDispatch, useSelector } from 'react-redux';
import { getClientTypesFromServer } from '../../../../features/clientType/clientTypeSlice';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { clientTypeService } from '../../../../features/clientType/clientTypeService';
import Meta from '../../../../utils/Meta';
import ReactPaginate from 'react-paginate';

const ClientType = () => {

    const dispatch = useDispatch();
    const clientTypeState = useSelector((state) => state.clientType);

    useEffect(() => {
        dispatch(getClientTypesFromServer({ page: 1, limit: 5 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteClientType = async (typeId) => {
        const result = await swalCheck("client-type");
        if(result.isConfirmed){
            try {
                const results = await clientTypeService.deleteClientType(typeId);
                if(results.status){
                  dispatch(getClientTypesFromServer({ page: 1, limit: 5 }));
                  swalDeleteMsg("city");
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
      dispatch(getClientTypesFromServer(data));
    }
  
    let pageCount = Math.ceil(clientTypeState.count / 5);

  return (
    <>
    <Meta title="Client Types" />
    <div className="d-flex align-items-center justify-content-between px-3">
      <h3>Client Type</h3>
      <Link to={"new"} className='btn btn-primary'>Add ClientType</Link>
    </div>

    <Table className='mt-2' responsive="xl" striped hover size bordered variant='dark' >
        <thead>
            <tr>
                <th>Client Type</th>
                <th>Active</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            { clientTypeState.clientTypes ? clientTypeState.clientTypes.map((clientType) => {
                return (
                  <tr key={clientType.id}>
                    <td>{clientType.client_type}</td>
                    <td>
                      {clientType.status ? (
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
                        to={`edit/${clientType.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClientType(clientType.id)}
                        className="btn btn-danger btn-sm ms-3"
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
            !clientTypeState.clientTypes && <span className='text-center text-dark'>{clientTypeState.message}!!..</span>
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

export default ClientType