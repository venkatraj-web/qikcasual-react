import React from 'react'
import useInput from '../../../hooks/use-input';
// import { useDispatch, useSelector } from 'react-redux';
import { cityService } from '../../../features/city/cityService';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const AddCity = () => {

    let formIsValid = false;
    const isNotEmpty = value => value.trim() !== '';
    // const dispatch = useDispatch();
    // const cityState = useSelector((state) => state.city);
    const navigate = useNavigate();

    const {
        value: enteredCityName,
        isValid: enteredCityNameIsValid,
        hasError: cityNameInputHasError,
        valueChangeHandler: cityNameChangeHandler,
        inputBlurhandler: cityNameBlurHandler
    } = useInput(isNotEmpty);

    if(enteredCityNameIsValid){
        formIsValid = true;
    }

    const storeCity = async (cityData) => {
        try{
            const result = await cityService.addCityToServer(cityData);
            toast.success(result.message);
            navigate("..");
        }catch(err){
            const result = apiErrorHandler(err);
            toast.warning(result.message);
        }
    }

    const handleCityCreate = (e) => {
        e.preventDefault();
        if(!enteredCityNameIsValid){
            return;
        }

        const cityData = {
            city_name: enteredCityName
        }

        storeCity(cityData);
    }

  return (
    <>
      <h3>AddCity</h3>

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="form-wrapper p-3">
            <form onSubmit={handleCityCreate}>
              <div className="form-group">
                <label htmlFor="city_name">City Name</label>
                <input
                  type="text"
                  name="city_name"
                  id="city_name"
                  className="form-control mt-2"
                  value={enteredCityName}
                  onChange={cityNameChangeHandler}
                  onBlur={cityNameBlurHandler}
                />
                { cityNameInputHasError && (<p className='text-danger'>City Name must not be Empty!</p>)}
              </div>
              <div className="actions mt-4">
                <button disabled={!formIsValid} className="btn btn-primary btn-sm">
                  Create
                </button>
                <Link to={".."} className='btn btn-info btn-sm ms-2'>Back</Link>
              </div>
            </form>
          </div>
      </div>
      </div>
    </>
  );
}

export default AddCity