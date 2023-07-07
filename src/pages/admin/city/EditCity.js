import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { updateCityById } from '../../../features/city/citySlice';
import { cityService } from '../../../features/city/cityService';
import useInput from '../../../hooks/use-input';
import Form from 'react-bootstrap/Form';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';

const EditCity = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cityState = useSelector((state) => state.city);
    const errors = { city_name: "", status: null };

    const isNotEmpty = value => value.trim() !== '';

    const [status, setStatus] = useState(false);

    const {
      value : enteredCityName,
      isValid : enteredCityNameisValid,
      hasError: cityNameInputHasError,
      valueChangeHandler: cityNameChangeHandler,
      inputBlurhandler: cityNameBlurHandler,
      oldValue: oldCityName
    } = useInput(isNotEmpty);

    useEffect(() => {
      getCity(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const getCity = async () => {
      try {
        const result = await cityService.getCityById(params.id);
        oldCityName(result.city.city_name);
        setStatus(result.city.status);
      } catch (err) { 
        const result = apiErrorHandler(err);
        // console.log(result);
        if(!result.status){
            toast.warn(result.message);
            navigate("..")
        }
      }
    }

    let formIsValid = false;

    if(enteredCityNameisValid){
      formIsValid = true;
    }

    const handleCityUpdate = (e) => {
      e.preventDefault();

      if(!enteredCityNameisValid){
        return;
      }

      const cityData = {
        id: params.id,
        city_name: enteredCityName,
        status
      };

      dispatch(updateCityById(cityData));
      // console.log(cityData);
    }

    if(cityState.error){
      for(let key in errors) {
        if(cityState.error.hasOwnProperty('error') && Array.isArray(cityState.error.error)){
          for(let errData of cityState.error.error){
            if(key === errData.param && errors[key] === null){
              errors[key] = errData.msg;
              console.log(errData.msg);
            }
          }
        }
      }
    }

    const handleCityStatus = () => {
      setStatus(() => {
        return !status;
      })
    }

  return (
    <div className='p-3'>
      <h2>Edit City </h2>

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="form-wrapper p-3">
            <form onSubmit={handleCityUpdate}>
              <div className="form-group">
                <label htmlFor="city_name">City Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="city_name"
                  id="city_name"
                  value={enteredCityName}
                  onChange={cityNameChangeHandler}
                  onBlur={cityNameBlurHandler}
                />
                {cityNameInputHasError && (
                  <p className="text-danger">City Name must not be empty!</p>
                )}
                {cityState.error && (
                  <span className="text-danger">{errors.city_name}</span>
                )}
              </div>
              <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Status"
                checked={status}
                onChange={handleCityStatus}
                className='mt-3'
              />
              {cityState.error && (
                <span className="text-danger">{errors.status}</span>
              )}
              <div className="actions mt-4">
                <button className="btn btn-primary btn-sm" disabled={!formIsValid}>
                  Update
                </button>
                <Link to={".."} className='btn btn-info btn-sm ms-2'>Back</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCity