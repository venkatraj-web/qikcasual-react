import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../../../../hooks/use-input';
import Meta from '../../../../utils/Meta';
import { jobTypeService } from '../../../../features/jobType/jobTypeService';
import { toast } from 'react-toastify';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { addJobTypeError } from '../../../../features/jobType/jobTypeSlice';

const AddJobType = () => {

    let formIsValid = false;
    const isNotEmpty = value => value.trim() !== "";
    const navigate = useNavigate();
    const errors = { jobType: "", status: "" };
    const jobTypeState = useSelector((state) => state.jobType);
    const dispatch = useDispatch();

    const {
        value: enteredJobType,
        isValid: enteredJobTypeIsValid,
        valueChangeHandler: jobTypeChangeHandler,
        inputBlurhandler: jobTypeBlurHandler,
        hasError: jobTypeInputHasError,
    } = useInput(isNotEmpty);

    if(enteredJobTypeIsValid){
        formIsValid = true;
    }

    const storeJobType = async (data) => {
        try {
            const result = await jobTypeService.addJobTypeToServer(data);
            // console.log(result);
            toast.success(result.message);
            navigate("..");
        } catch (err) {
            const result = apiErrorHandler(err);
            dispatch(addJobTypeError(result))
            // console.log(result);
        }
    }

    const handleJobTypeCreate = (e) => {
        e.preventDefault();
        if(!enteredJobTypeIsValid){
            return;
        }

        const dataObj = {
            jobType : enteredJobType
        }

        storeJobType(dataObj);
    }


    if(jobTypeState.error){
      for(let key in errors) {
        if(jobTypeState.error.hasOwnProperty('error') && Array.isArray(jobTypeState.error.error)){
          for(let errData of jobTypeState.error.error){
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
    <Meta title="Add JobType" />
    <h3>Add JobType</h3>

<div className="row">
  <div className="col-12 col-md-6">
    <div className="form-wrapper p-3">
      <form onSubmit={handleJobTypeCreate}>
        <div className="form-group">
          <label htmlFor="jobType">Job Type</label>
          <input
            type="text"
            name="jobType"
            id="jobType"
            className="form-control mt-2"
            value={enteredJobType}
            onChange={jobTypeChangeHandler}
            onBlur={jobTypeBlurHandler}
          />
          { jobTypeInputHasError && (<p className='text-danger'>Job Type must not be Empty!</p>)}
          {jobTypeState.error && (
            <span className="text-danger">{errors.jobType}</span>
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
  )
}

export default AddJobType