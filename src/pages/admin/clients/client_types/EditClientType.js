import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Meta from '../../../../utils/Meta';
import useInput from '../../../../hooks/use-input';
import Form from 'react-bootstrap/Form'
import { useDispatch, useSelector } from 'react-redux';
import { apiErrorHandler } from '../../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { clientTypeService } from '../../../../features/clientType/clientTypeService';
import { updateClientTypeById } from '../../../../features/clientType/clientTypeSlice';

const EditClientType = () => {
    const params = useParams();

    let formIsValid = false;
    const isNotEmpty = value => value.trim() !== "";
    const clientTypeState = useSelector((state) => state.clientType);
    const navigate = useNavigate();
    const [status, setStatus] = useState(false);
    const errors = { client_type: "", status: null };
    const dispatch = useDispatch();

    const {
        value: enteredClientType,
        isValid: enteredClientTypeIsValid,
        valueChangeHandler: clientTypeChangeHandler,
        inputBlurhandler: clientTypeBlurHandler,
        hasError: clientTypeInputHasError,
        oldValue: oldClientType
    } = useInput(isNotEmpty);

    if(enteredClientTypeIsValid){
        formIsValid = true;
    }

    useEffect(() => {
        getClientType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getClientType = async () => {
        try {
            const result = await clientTypeService.getClientTypeById(params.id);
            // console.log(result.client_type.client_type)
            oldClientType(result.client_type.client_type);
            setStatus(result.client_type.status);
        } catch (err) {
            const result = apiErrorHandler(err);
            if(!result.status){
                toast.warn(result.message);
                navigate("..");
            }
        }
    }

    const handleClientTypeUpdate = (e) => {
        e.preventDefault();

        if(!enteredClientTypeIsValid){
            return;
        }

        const clientTypeObj = {
            id: params.id,
            client_type: enteredClientType,
            status
        }

        dispatch(updateClientTypeById(clientTypeObj));
        // console.log(clientTypeObj)
    }

    if(clientTypeState.error){
      for(let key in errors) {
        if(clientTypeState.error.hasOwnProperty('error') && Array.isArray(clientTypeState.error.error)){
          for(let errData of clientTypeState.error.error){
            if(key === errData.param && errors[key] === null){
              errors[key] = errData.msg;
              // console.log(errData.msg);
            }
          }
        }
      }
    }

    const handleClientTypeStatus = () => {
        setStatus(() => {
            return !status;
        })
    }


  return (
    <>
      <Meta title="Edit ClientType" />
      <h2>Edit ClientType</h2>

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="form-wrapper p-3">
            <form onSubmit={handleClientTypeUpdate}>
              <div className="form-group">
                <label htmlFor="client_type">Client Type</label>
                <input
                  type="text"
                  name="client_type"
                  id="client_type"
                  className="form-control"
                  value={enteredClientType}
                  onChange={clientTypeChangeHandler}
                  onBlur={clientTypeBlurHandler}
                />
                {clientTypeInputHasError && (
                  <span className="text-danger">
                    ClientType must not be empty!
                  </span>
                )}
                {clientTypeState.error && (
                  <span className="text-danger">{errors.city_name}</span>
                )}
              </div>
              <Form.Check
                type="switch"
                checked={status}
                label="Status"
                id="status"
                onChange={handleClientTypeStatus}
                className='mt-3'
              />
              {clientTypeState.error && (
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

export default EditClientType