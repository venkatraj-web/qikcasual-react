import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../../../../hooks/use-input';
import Meta from '../../../../utils/Meta';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { propertyGradeService } from '../../../../features/propertyGrade/propertyGradeService';
import { addPropertyGradeError } from '../../../../features/propertyGrade/propertyGradeSlice';
import { getAllPropertyTypes } from '../../../../features/propertyType/propertyTypeSlice';

const AddPropertyGrade = () => {

    let formIsValid = false;
    const isNotEmpty = value => value.trim() !== "";
    // const checkInteger = value => Number.isInteger(parseInt(value));
    const navigate = useNavigate();
    const errors = { property_grade: "", status: "", propertyTypeId: "" };
    const propertyGradeState = useSelector((state) => state.propertyGrade);
    const propertyTypeState = useSelector((state) => state.propertyType);
    const dispatch = useDispatch();

    const {
        value: enteredPropertyGrade,
        isValid: enteredPropertyGradeIsValid,
        valueChangeHandler: propertyGradeChangeHandler,
        inputBlurhandler: propertyGradeBlurHandler,
        hasError: propertyGradeInputHasError,
    } = useInput(isNotEmpty);
    const {
        value: enteredPropertyType,
        isValid: enteredPropertyTypeIsValid,
        valueChangeHandler: propertyTypeChangeHandler,
        inputBlurhandler: propertyTypeBlurHandler,
        hasError: propertyTypeInputHasError,
    } = useInput(isNotEmpty);

    if(enteredPropertyGradeIsValid && enteredPropertyTypeIsValid){
        formIsValid = true;
    }

    useEffect(() => {
        dispatch(getAllPropertyTypes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const storePropertyGrade = async (data) => {
        try {
            const result = await propertyGradeService.addPropertyGradeToServer(data);
            // console.log(result);
            toast.success(result.message);
            navigate("..");
        } catch (err) {
            const result = apiErrorHandler(err);
            dispatch(addPropertyGradeError(result));
            // console.log(result);
        }
    }

    const handlePropertyGradeCreate = (e) => {
        e.preventDefault();
        if(!enteredPropertyGrade && !enteredPropertyType){
            return;
        }

        const dataObj = {
            property_grade : enteredPropertyGrade,
            propertyTypeId : enteredPropertyType 
        }

        storePropertyGrade(dataObj);
    }

    if(propertyGradeState.error){
      for(let key in errors) {
        if(propertyGradeState.error.hasOwnProperty('error') && Array.isArray(propertyGradeState.error.error)){
          for(let errData of propertyGradeState.error.error){
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
      <Meta title="Add PropertyGrade" />
      <h3>Add PropertyGrade</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handlePropertyGradeCreate}>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group mt-3">
                <label htmlFor="property_grade">Property Grade</label>
                <input
                  type="text"
                  name="property_grade"
                  id="property_grade"
                  className="form-control mt-2"
                  value={enteredPropertyGrade}
                  onChange={propertyGradeChangeHandler}
                  onBlur={propertyGradeBlurHandler}
                />
                {propertyGradeInputHasError && (
                  <p className="text-danger">
                    Property Grade must not be Empty!
                  </p>
                )}
                {propertyGradeState.error && (
                  <span className="text-danger">{errors.property_grade}</span>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group mt-3">
                <label htmlFor="propertyTypeId">Property Type</label>
                <select
                  name="propertyTypeId"
                  id="propertyTypeId"
                  className="form-select"
                  value={enteredPropertyType}
                  onChange={propertyTypeChangeHandler}
                  onBlur={propertyTypeBlurHandler}
                >
                  <option value="">-- Property Type --</option>
                  {propertyTypeState.propertyTypes &&
                    propertyTypeState.propertyTypes.map((propertType) => {
                      return (
                        <option key={propertType.id} value={propertType.id}>
                          {propertType.property_type}
                        </option>
                      );
                    })}
                </select>
                {propertyTypeInputHasError && (
                  <p className="text-danger">Property Type must not be empty!</p>
                )}
                {propertyGradeState.error && (<p className='text-danger'>{errors.propertyTypeId}</p>)}
              </div>
            </div>
          </div>
          <div className="actions mt-4">
            <button disabled={!formIsValid} className="btn btn-primary btn-sm">
              Create
            </button>
            <Link to={".."} className="btn btn-info btn-sm ms-2">
              Back
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddPropertyGrade