import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../../../../hooks/use-input';
import Meta from '../../../../utils/Meta';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { clientTypeService } from '../../../../features/clientType/clientTypeService';
import { useDispatch, useSelector } from 'react-redux';
import { addClientTypeError } from '../../../../features/clientType/clientTypeSlice';

const AddClientType = () => {

    let formIsValid = false;
    const isNotEmpty = value => value.trim() !== "";
    const navigate = useNavigate();
    const errors = { client_type: "", status: "" };
    const clientTypeState = useSelector((state) => state.clientType);
    const dispatch = useDispatch();

    const {
        value: enteredClientType,
        isValid: enteredClientTypeIsValid,
        valueChangeHandler: clientTypeChangeHandler,
        inputBlurhandler: clientTypeBlurHandler,
        hasError: clientTypeInputHasError,
    } = useInput(isNotEmpty);

    if(enteredClientTypeIsValid){
        formIsValid = true;
    }

    const storeClientType = async (data) => {
        try {
            const result = await clientTypeService.addClientTypeToServer(data);
            // console.log(result);
            toast.success(result.message);
            navigate("..");
        } catch (err) {
            const result = apiErrorHandler(err);
            dispatch(addClientTypeError(result))
            // console.log(result);
        }
    }

    const handleClientTypeCreate = (e) => {
        e.preventDefault();
        // console.log(`Create city ${enteredClientType}`);
        if(!enteredClientTypeIsValid){
            return ;
        }

        const dataObj = {
            client_type : enteredClientType
        }

        storeClientType(dataObj);
    }

    if(clientTypeState.error){
      for(let key in errors) {
        if(clientTypeState.error.hasOwnProperty('error') && Array.isArray(clientTypeState.error.error)){
          for(let errData of clientTypeState.error.error){
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
      <Meta title={"Add ClientType"} />
      <h3>Add ClientType</h3>

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="form-wrapper p-3">
            <form onSubmit={handleClientTypeCreate}>
              <div className="form-group">
                <label htmlFor="client_type">Client Type</label>
                <input
                  type="text"
                  name="client_type"
                  id="client_type"
                  className="form-control mt-2"
                  value={enteredClientType}
                  onChange={clientTypeChangeHandler}
                  onBlur={clientTypeBlurHandler}
                />
                { clientTypeInputHasError && (<p className='text-danger'>Client Type must not be Empty!</p>)}
                {clientTypeState.error && (
                  <span className="text-danger">{errors.client_type}</span>
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

export default AddClientType