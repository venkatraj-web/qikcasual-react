import React, { useEffect } from 'react'
import Meta from '../../../utils/Meta'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getAllClients } from '../../../features/clients/clientSlice';
import Table from 'react-bootstrap/Table';
import { swalCheck, swalDeleteMsg } from '../../../components/swal/Swal';
import { toast } from 'react-toastify';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { clientService } from '../../../features/clients/clientService';
import { S3_URL } from '../../../utils/apiConfig';
import { BsPersonSquare } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';

const Client = () => {

  const dispatch = useDispatch();
  const clientState = useSelector((state) => state.client);

  useEffect(() => {
      dispatch(getAllClients({ page: 1, limit: 5 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteClient = async (clientId) => {
      const result = await swalCheck("client");
      if(result.isConfirmed){
          try {
              const results = await clientService.deleteClientById(clientId);
              if(results.status){
                dispatch(getAllClients({ page: 1, limit: 5 }));
                swalDeleteMsg("client");
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
    dispatch(getAllClients(data));
  }

  let pageCount = Math.ceil(clientState.count / 5);

  return (
    <>
      <Meta title="Client" />
      <div className="box-wrapper">
        <div className="d-flex align-items-center justify-content-between px-3">
          <h3>Client</h3>
          <Link to={"new"} className="btn btn-primary">
            Add Client
          </Link>
        </div>

        <Table
          className="mt-2"
          responsive="xl"
          striped
          hover
          size
          bordered
          variant="dark"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>ClientName</th>
              <th>ClientType</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientState.clients ?
              clientState.clients.map((client) => {
                return (
                  <tr key={client.id}>
                    <td>{client.client_id}</td>
                    <td align="center">
                      <div className="avatar">
                        {client.client_avatar ? (
                          <img
                            src={`${S3_URL + client.client_avatar}`}
                            alt="avatar"
                            className="img-fluid"
                          />
                        ) : (
                          <BsPersonSquare className="fs-2" />
                        )}
                      </div>
                    </td>
                    <td>{client.client_name}</td>
                    <td>
                      {client.client_type ? (
                        client.client_type.client_type
                      ) : (
                        <span className="badge text-bg-info">
                          No ClientType
                        </span>
                      )}
                    </td>
                    <td>
                      {client.city ? (
                        client.city.city_name
                      ) : (
                        <div className="badge text-bg-info rounded-pill">
                          No City
                        </div>
                      )}
                    </td>
                    <td>
                      {client.active ? (
                        <div className="badge text-bg-success rounded-pill">
                          Active
                        </div>
                      ) : (
                        <div className="badge text-bg-info rounded-pill">
                          Deactive
                        </div>
                      )}</td>
                    <td>
                      <Link
                        to={`edit/${client.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
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
            !clientState.clients && <span className='text-center text-dark'>{clientState.message}!!..</span>
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

export default Client