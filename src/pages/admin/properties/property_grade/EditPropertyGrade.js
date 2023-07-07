import React, { useEffect, useState } from 'react'
import Meta from '../../../../utils/Meta'
import Form from 'react-bootstrap/Form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../../hooks/use-input';
import { getAllPropertyTypes } from '../../../../features/propertyType/propertyTypeSlice';
import { toast } from 'react-toastify';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { propertyGradeService } from '../../../../features/propertyGrade/propertyGradeService';
import { updatePropertGradeById } from '../../../../features/propertyGrade/propertyGradeSlice';

const EditPropertyGrade = () => {

    let formIsValid = false;
    const params = useParams();
    const isNotEmpty = value => value.trim() !== "";
    const checkInteger = value => Number.isInteger(parseInt(value));
    const [status, setStatus] = useState(false);
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
        oldValue: oldPropertyGrade
    } = useInput(isNotEmpty);
    const {
        value: enteredPropertyTypeId,
        isValid: enteredPropertyTypeIdIsValid,
        valueChangeHandler: propertyTypeIdChangeHandler,
        inputBlurhandler: propertyTypeIdBlurHandler,
        hasError: propertyTypeIdInputHasError,
        oldValue: oldPropertyTypeId
    } = useInput(checkInteger);

    if(enteredPropertyGradeIsValid && enteredPropertyTypeIdIsValid){
        formIsValid = true;
    }

    useEffect(() => {
        dispatch(getAllPropertyTypes());
        getPropertyGrade();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPropertyGrade = async () => {
        try {
            const result = await propertyGradeService.getPropertGradeById(params.id);
            oldPropertyGrade(result.property_grade.property_grade);
            oldPropertyTypeId(result.property_grade.propertyTypeId);
            setStatus(result.property_grade.status);
        } catch (err) {
            const result = apiErrorHandler(err);
            if(!result.status){
                toast.warn(result.message);
                navigate("..");
            }
        }
    }

    const handlePropertyGradeUpdate = (e) => {
        e.preventDefault();
        if(!enteredPropertyGrade && !enteredPropertyTypeIdIsValid){
            return;
        }

        const dataObj = {
            property_grade : enteredPropertyGrade,
            propertyTypeId : enteredPropertyTypeId,
            id: params.id,
            status
        }
        dispatch(updatePropertGradeById(dataObj));
    }

    if(propertyGradeState.error){
      for (let key in errors) {
        if (
          propertyGradeState.error.hasOwnProperty("error") &&
          Array.isArray(propertyGradeState.error.error)
        ) {
          for (let errData of propertyGradeState.error.error) {
            if (key === errData.param && errors[key] === "") {
              errors[key] = errData.msg;
              // console.log(errData.msg);
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
      <Meta title="Edit PropertyGrade" />
      <h2>Edit PropertyGrade</h2>

      <div className="form-wrapper p-3">
        <form onSubmit={handlePropertyGradeUpdate}>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group mt-3">
                <label htmlFor="property_grade">Property Grade</label>
                <input
                  type="text"
                  name="property_grade"
                  id="property_grade"
                  className="form-control"
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
                  value={enteredPropertyTypeId}
                  onChange={propertyTypeIdChangeHandler}
                  onBlur={propertyTypeIdBlurHandler}
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
                {propertyTypeIdInputHasError && (
                  <p className="text-danger">
                    Property Type must not be empty!
                  </p>
                )}
                {propertyGradeState.error && (
                  <p className="text-danger">{errors.propertyTypeId}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <Form.Check
                checked={status}
                className="mt-3"
                type="switch"
                label="Status"
                id="status"
                onChange={handlePropertyTypeStatus}
              />
            </div>
          </div>
          <div className="actions mt-3">
            <button disabled={!formIsValid} className="btn btn-primary btn-sm">
              Update
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

export default EditPropertyGrade