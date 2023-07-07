import React, { useEffect, useState } from 'react'
import Meta from '../../../../utils/Meta'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../../hooks/use-input';
import { toast } from 'react-toastify';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { jobTypeService } from '../../../../features/jobType/jobTypeService';
import { updateJobTypeById } from '../../../../features/jobType/jobTypeSlice';
import Form from 'react-bootstrap/Form';

const EditJobType = () => {

    const params = useParams();
    let formIsValid = false;
    const isNotEmpty = value => value.trim() !== "";
    const navigate = useNavigate();
    const errors = { jobType: "", status: "" };
    const [status, setStatus] = useState(false);
    const jobTypeState = useSelector((state) => state.jobType);
    const dispatch = useDispatch();

    const {
        value: enteredJobType,
        isValid: enteredJobTypeIsValid,
        valueChangeHandler: jobTypeChangeHandler,
        inputBlurhandler: jobTypeBlurHandler,
        hasError: jobTypeInputHasError,
        oldValue: oldJobType,
    } = useInput(isNotEmpty);

    if(enteredJobTypeIsValid){
        formIsValid = true;
    }

    useEffect(() => {
        getJobType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    const getJobType = async () => {
        try {
            const result = await jobTypeService.getJobTypeById(params.id);
            oldJobType(result.jobType.jobType);
            setStatus(result.jobType.status);
        } catch (err) {
            const result = apiErrorHandler(err);
            if(!result.status){
                toast.warn(result.message);
                navigate("..");
            }
        }
    }

    const handleJobTypeUpdate = (e) => {
        e.preventDefault();

        if(!enteredJobTypeIsValid){
            return;
        }

        const jobTypeObj = {
            id: params.id,
            jobType: enteredJobType,
            status
        }

        dispatch(updateJobTypeById(jobTypeObj));
        // console.log(jobTypeObj)
    }

    if(jobTypeState.error){
      for(let key in errors) {
        if(jobTypeState.error.hasOwnProperty('error') && Array.isArray(jobTypeState.error.error)){
          for(let errData of jobTypeState.error.error){
            if(key === errData.param && errors[key] === null){
              errors[key] = errData.msg;
            //   console.log(errData.msg);
            }
          }
        }
      }
    }

    const handleJobTypeStatus = () => {
        setStatus(() => {
            return !status;
        })
    }


  return (
    <>
    <Meta title="Edit JobType" />
    <h2>Edit JobType</h2>

<div className="row">
  <div className="col-12 col-md-6">
    <div className="form-wrapper p-3">
      <form onSubmit={handleJobTypeUpdate}>
        <div className="form-group">
          <label htmlFor="property_type">Property Type</label>
          <input
            type="text"
            name="property_type"
            id="property_type"
            className="form-control"
            value={enteredJobType}
            onChange={jobTypeChangeHandler}
            onBlur={jobTypeBlurHandler}
          />
          {jobTypeInputHasError && (
            <span className="text-danger">
              PropertyType must not be empty!
            </span>
          )}
          {jobTypeState.error && (
            <span className="text-danger">{errors.jobType}</span>
          )}
        </div>
        <Form.Check
          type="switch"
          checked={status}
          label="Status"
          id="status"
          onChange={handleJobTypeStatus}
          className='mt-3'
        />
        {jobTypeState.error && (
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
  )
}

export default EditJobType