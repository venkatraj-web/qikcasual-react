import React, { useEffect, useState } from 'react'
import Meta from '../../../../utils/Meta'
import useInput from '../../../../hooks/use-input';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { updatePropertyTypeById } from '../../../../features/propertyType/propertyTypeSlice';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { propertyTypeService } from '../../../../features/propertyType/propertyTypeService';
import Form from 'react-bootstrap/Form';

const EditPropertyType = () => {

    const params = useParams();
    let formIsValid = false;
    const isNotEmpty = value => value.trim() !== "";
    const navigate = useNavigate();
    const errors = { property_type: "", status: "" };
    const [status, setStatus] = useState(false);
    const propertyTypeState = useSelector((state) => state.propertyType);
    const dispatch = useDispatch();

    const {
        value: enteredPropertyType,
        isValid: enteredPropertyTypeIsValid,
        valueChangeHandler: propertyTypeChangeHandler,
        inputBlurhandler: propertyTypeBlurHandler,
        hasError: propertyTypeInputHasError,
        oldValue: oldPropertyType
    } = useInput(isNotEmpty);

    if(enteredPropertyTypeIsValid){
        formIsValid = true;
    }

    useEffect(() => {
        getPropertyType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    const getPropertyType = async () => {
        try {
            const result = await propertyTypeService.getPropertyTypeById(params.id);
            oldPropertyType(result.property_type.property_type);
            setStatus(result.property_type.status);
        } catch (err) {
            const result = apiErrorHandler(err);
            if(!result.status){
                toast.warn(result.message);
                navigate("..");
            }
        }
    }

    const handlePropertyTypeUpdate = (e) => {
        e.preventDefault();

        if(!enteredPropertyType){
            return;
        }

        const propertyTypeObj = {
            id: params.id,
            property_type: enteredPropertyType,
            status
        }

        dispatch(updatePropertyTypeById(propertyTypeObj));
        // console.log(propertyTypeObj)
    }

    if(propertyTypeState.error){
      for(let key in errors) {
        if(propertyTypeState.error.hasOwnProperty('error') && Array.isArray(propertyTypeState.error.error)){
          for(let errData of propertyTypeState.error.error){
            if(key === errData.param && errors[key] === null){
              errors[key] = errData.msg;
            //   console.log(errData.msg);
            }
          }
        }
      }
    }

    const handlePropertyTypeStatus = () => {
        setStatus(() => {
            return !status;
        })
    }

    
  return (
    <>
      <Meta title="Edit PropertyType" />
      <h2>Edit PropertyType</h2>

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="form-wrapper p-3">
            <form onSubmit={handlePropertyTypeUpdate}>
              <div className="form-group">
                <label htmlFor="property_type">Property Type</label>
                <input
                  type="text"
                  name="property_type"
                  id="property_type"
                  className="form-control"
                  value={enteredPropertyType}
                  onChange={propertyTypeChangeHandler}
                  onBlur={propertyTypeBlurHandler}
                />
                {propertyTypeInputHasError && (
                  <span className="text-danger">
                    PropertyType must not be empty!
                  </span>
                )}
                {propertyTypeState.error && (
                  <span className="text-danger">{errors.property_type}</span>
                )}
              </div>
              <Form.Check
                type="switch"
                checked={status}
                label="Status"
                id="status"
                onChange={handlePropertyTypeStatus}
                className='mt-3'
              />
              {propertyTypeState.error && (
                <span className="text-danger">{errors.status}</span>
              )}
              <div className="actions mt-4">
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!formIsValid}
                >
                  Update
                </button>
                <Link to={".."} className="btn btn-info btn-sm ms-2">
                  Back
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditPropertyType