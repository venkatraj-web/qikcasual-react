import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table'
import { Link } from 'react-router-dom'
import { getCitiesFromServer } from '../../../features/city/citySlice';
import { swalCheck, swalDeleteMsg } from '../../../components/swal/Swal';
import { cityService } from '../../../features/city/cityService';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const City = () => {
  const dispatch = useDispatch();
  const cityState = useSelector((state) => state.city);
  // console.log(cityState);

  useEffect(() => {
    dispatch(getCitiesFromServer({ page: 1, limit: 5 }));
  }, [dispatch]);

  const handleCityDelete = async (cityId) => {
    // console.log(cityId);
    const result = await swalCheck("city");
    if(result.isConfirmed){
      // dispatch(deleteCity(cityId));
      try{
        const results = await cityService.deleteCity(cityId);
        if(results.status){
          dispatch(getCitiesFromServer({ page: 1, limit: 5 }));
          swalDeleteMsg("city");
        }
      }catch(err){
        const results = apiErrorHandler(err);
        console.log(results);
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
    dispatch(getCitiesFromServer(data));
  }

  let pageCount = Math.ceil(cityState.count / 5);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between px-3">
        <h3>City</h3>
        <Link to={"add"} className='btn btn-primary'>Add City</Link>
      </div>
      <Table className='mt-2' bordered striped hover variant='dark' size responsive="xl">
        <thead>
          <tr>
            <th>City Name</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            cityState.cities && cityState.cities.map(city => {
              return (
                <tr key={city.id}>
                  <td>{city.city_name}</td>
                  <td>
                    {city.status ? (
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
                      className="btn btn-primary btn-sm mx-2"
                      to={`edit/${city.id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm mx-2"
                      onClick={() => handleCityDelete(city.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
          {
            !cityState.cities && <span className='text-center text-dark'>{cityState.message}!!..</span>
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

export default City