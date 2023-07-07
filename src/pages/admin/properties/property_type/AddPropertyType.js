import React from 'react'
import Meta from '../../../../utils/Meta'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../../hooks/use-input';
import { toast } from 'react-toastify';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { propertyTypeService } from '../../../../features/propertyType/propertyTypeService';
import { addPropertyTypeError } from '../../../../features/propertyType/propertyTypeSlice';

const AddPropertyType = () => {

    let formIsValid = false;
    const isNotEmpty = value => value.trim() !== "";
    const navigate = useNavigate();
    const errors = { property_type: "", status: "" };
    const propertyTypeState = useSelector((state) => state.propertyType);
    const dispatch = useDispatch();

    const {
        value: enteredPropertyType,
        isValid: enteredPropertyTypeIsValid,
        valueChangeHandler: propertyTypeChangeHandler,
        inputBlurhandler: propertyTypeBlurHandler,
        hasError: propertyTypeInputHasError,
    } = useInput(isNotEmpty);

    if(enteredPropertyTypeIsValid){
        formIsValid = true;
    }

    const storePropertyType = async (data) => {
        try {
            const result = await propertyTypeService.addPropertyTypeToServer(data);
            // console.log(result);
            toast.success(result.message);
            navigate("..");
        } catch (err) {
            const result = apiErrorHandler(err);
            dispatch(addPropertyTypeError(result))
            // console.log(result);
        }
    }

    const handlePropertyTypeCreate = (e) => {
        e.preventDefault();
        if(!enteredPropertyTypeIsValid){
            return;
        }

        const dataObj = {
            property_type : enteredPropertyType
        }

        storePropertyType(dataObj);
    }

    if(propertyTypeState.error){
      for(let key in errors) {
        if(propertyTypeState.error.hasOwnProperty('error') && Array.isArray(propertyTypeState.error.error)){
          for(let errData of propertyTypeState.error.error){
            if(key === errData.param && errors[key] === ""){
              errors[key] = errData.msg;
              // console.log(errData.msg);
            }
          }
        }
      }
    }

    
  return (
    <>
      <Meta title="Add PropertyType" />
      <h3>Add PropertyType</h3>

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="form-wrapper p-3">
            <form onSubmit={handlePropertyTypeCreate}>
              <div className="form-group">
                <label htmlFor="property_type">Property Type</label>
                <input
                  type="text"
                  name="property_type"
                  id="property_type"
                  className="form-control mt-2"
                  value={enteredPropertyType}
                  onChange={propertyTypeChangeHandler}
                  onBlur={propertyTypeBlurHandler}
                />
                { propertyTypeInputHasError && (<p className='text-danger'>Property Type must not be Empty!</p>)}
                {propertyTypeState.error && (
                  <span className="text-danger">{errors.property_type}</span>
                )}
              </div>
              <div className="actions mt-4">
                <button disabled={!formIsValid} className='btn btn-primary btn-sm'>Create</button>
                <Link to={".."} className='btn btn-info btn-sm ms-2'>Back</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPropertyType