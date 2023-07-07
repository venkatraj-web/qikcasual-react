import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCities } from '../../../features/city/citySlice';
import { getClientTypes } from '../../../features/clientType/clientTypeSlice';
import useInput from '../../../hooks/use-input';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { addClientError } from '../../../features/clients/clientSlice';
import { clientService } from '../../../features/clients/clientService';
import { BsPersonSquare } from 'react-icons/bs';

const AddClient = () => {

  let formIsValid = false;
  const dispatch = useDispatch();
  const cityState = useSelector((state) => state.city);
  const clientState = useSelector((state) => state.client);
  const clientTypeState = useSelector((state) => state.clientType);
  const isNotEmpty = value => value.trim() !== "";
  const isPhoneNo = value => value.length <= 10 && value.length >= 8;
  const navigate = useNavigate();

  const [adminEmails, setAdminEmails] = useState([]);
  const [errorEmailData, setErrorEmailData] = useState();
  const [userAvatar, setUserAvatar] = useState('');

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurhandler: nameBlurHandler
  } = useInput(isNotEmpty);
  const {
    value: enteredPhoneNo,
    isValid: enteredPhoneNoIsValid,
    hasError: phoneNoInputHasError,
    valueChangeHandler: phoneNoChangeHandler,
    inputBlurhandler: phoneNoBlurHandler
  } = useInput(isPhoneNo);
  const {
    value: enteredNoOfProperties,
    isValid: enteredNoOfPropertiesIsValid,
    hasError: noOfPropertiesInputHasError,
    valueChangeHandler: noOfPropertiesChangeHandler,
    inputBlurhandler: noOfPropertiesBlurHandler
  } = useInput(isNotEmpty);
  const {
    value: enteredAddress,
    isValid: enteredAddressIsValid,
    hasError: addressInputHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurhandler: addressBlurHandler
  } = useInput(isNotEmpty);
  const {
      value: enteredCityId,
      isValid: enteredCityIdIsValid,
      hasError: cityIdInputHasError,
      valueChangeHandler: cityIdChangeHandler,
      inputBlurhandler: cityIdBlurHandler
  } = useInput(isNotEmpty);
  const {
      value: enteredClientTypeId,
      isValid: enteredClientTypeIdIsValid,
      hasError: clientTypeIdInputHasError,
      valueChangeHandler: clientTypeIdChangeHandler,
      inputBlurhandler: clientTypeIdBlurHandler
  } = useInput(isNotEmpty);

  useEffect(() => {
    dispatch(getAllCities());
    dispatch(getClientTypes());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  if (
    enteredNameIsValid &&
    enteredPhoneNoIsValid &&
    enteredNoOfPropertiesIsValid &&
    // enteredAddressIsValid &&
    enteredCityIdIsValid &&
    enteredClientTypeIdIsValid
  ) {
    formIsValid = true;
  }

  const errors = {
    client_name : "",
    client_phone_no : "",
    no_of_properties : "",
    address : "",
    cityId : "",
    clientTypeId : "",
    client_admin_email : "",
    client_avatar: ""
  }

  if(clientState.error){
    for(let key in errors) {
      if(Array.isArray(clientState.error)){
        for(let errData of clientState.error){
          if(key === errData.param && errors[key] === ""){
            errors[key] = errData.msg;
          }
        }
      }
    }
  }

  const storeClient = async (clientData) => {
    try {
      const result = await clientService.addClientToServer(clientData);
      if(result.status){
        toast.success(result.message);
        navigate("..");
      }
    } catch (err) {
      const result = apiErrorHandler(err);
      if(result.error_email_data){
        setErrorEmailData(JSON.stringify(result.error_email_data))
      }else if(result.duplicate_email_data){
        setErrorEmailData(JSON.stringify(result.duplicate_email_data))
      }
      dispatch(addClientError(result.error));
      toast.warning(result.message);
    }
  }

  const handleClientAdminEmailChange = (onChangeValue, idx) => {
    const inputData = [...adminEmails];
    inputData[idx] = onChangeValue.target.value;
    setAdminEmails(inputData);
    // setAdminEmails((prev) => {
    //   return [...prev, adminEmails[idx] = onChangeValue.target.value];
    // })
  }

  const handleDeleteClientAdminEmail = (idx) => {
    const deleteVal = [...adminEmails];
    deleteVal.splice(idx, 1);
    setAdminEmails(deleteVal);
  }
  
  const handleAddClientAdminEmail = () => {
    const abc = [...adminEmails, []];
    setAdminEmails(abc);
    // setAdminEmails((prev) => {
    //   return [...prev, []];
    // })
  }

  const handleAvatarChange = (e) => {
    // console.log(e.target.files[0]);
    // console.log(e.target.files);
    setUserAvatar(e.target.files[0])
  }

  const handleClientCreate = (e) => {
    e.preventDefault();
    
    if (
      !enteredNameIsValid &&
      !enteredPhoneNoIsValid &&
      !enteredNoOfPropertiesIsValid &&
      // !enteredAddressIsValid &&
      !enteredCityIdIsValid &&
      !enteredClientTypeIdIsValid
    ) {
      return;
    }
    
    const clientObj = new FormData();

    clientObj.append('client_name', enteredName);
    clientObj.append('client_phone_no', enteredPhoneNo);
    clientObj.append('cityId', enteredCityId);
    clientObj.append('clientTypeId', enteredClientTypeId);
    clientObj.append('no_of_properties', enteredNoOfProperties);
    clientObj.append('client_admin_email', JSON.stringify(adminEmails));
    clientObj.append('client_avatar', userAvatar);
    enteredAddress && clientObj.append('address', enteredAddress);

    storeClient(clientObj);

  }

  // console.log(adminEmails, "Email-");

  return (
    <>
      <Meta title="Add Client" />
      <h3>Add Client</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handleClientCreate}>
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="client_name">Client Name</label>
                <input
                  type="text"
                  name="client_name"
                  id="client_name"
                  className="form-control"
                  value={enteredName}
                  onChange={nameChangeHandler}
                  onBlur={nameBlurHandler}
                />
                {nameInputHasError && (
                  <span className="text-danger">Name must not be empty!</span>
                )}
                {clientState.error && (
                  <p className="text-danger">{errors.client_name}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="client_phone_no">Phone Number</label>
                <input
                  type="number"
                  name="client_phone_no"
                  id="client_phone_no"
                  className="form-control"
                  value={enteredPhoneNo}
                  onChange={phoneNoChangeHandler}
                  onBlur={phoneNoBlurHandler}
                />
                {phoneNoInputHasError && (
                  <span className="text-danger">
                    PhoneNo must not be empty!
                  </span>
                )}
                {clientState.error && (
                  <p className="text-danger">{errors.client_phone_no}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="no_of_properties">NoOf Properties</label>
                <input
                  type="number"
                  name="no_of_properties"
                  id="no_of_properties"
                  className="form-control"
                  value={enteredNoOfProperties}
                  onChange={noOfPropertiesChangeHandler}
                  onBlur={noOfPropertiesBlurHandler}
                />
                {noOfPropertiesInputHasError && (
                  <span className="text-danger">
                    NoOf Properties must not be empty!
                  </span>
                )}
                {clientState.error && (
                  <p className="text-danger">{errors.no_of_properties}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="address">Address</label>
                <textarea
                  name="address"
                  id="address"
                  cols="30"
                  rows="2"
                  className="form-control"
                  onChange={addressChangeHandler}
                  onBlur={addressBlurHandler}
                  defaultValue={enteredAddress}
                ></textarea>
                {addressInputHasError && !enteredAddressIsValid && (
                  <span className="text-danger">Address is Optional!</span>
                )}
                {clientState.error && (
                  <p className="text-danger">{errors.address}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="cityId">City</label>
                <select
                  name="cityId"
                  id="cityId"
                  className="form-select"
                  value={enteredCityId}
                  onChange={cityIdChangeHandler}
                  onBlur={cityIdBlurHandler}
                >
                  <option value="">-- City --</option>
                  {cityState.cities &&
                    cityState.cities.map((city) => {
                      return (
                        <option key={city.id} value={city.id}>
                          {city.city_name}
                        </option>
                      );
                    })}
                </select>
                {cityIdInputHasError && (
                  <p className="text-danger">City must not be empty!!</p>
                )}
                {clientState.error && (
                  <p className="text-danger">{errors.cityId}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="clientTypeId">Client Type</label>
                <select
                  name="clientTypeId"
                  id="clientTypeId"
                  className="form-select"
                  value={enteredClientTypeId}
                  onChange={clientTypeIdChangeHandler}
                  onBlur={clientTypeIdBlurHandler}
                >
                  <option value="">-- Client Type --</option>
                  {clientTypeState.clientTypes &&
                    clientTypeState.clientTypes.map((clientType) => {
                      return (
                        <option key={clientType.id} value={clientType.id}>
                          {clientType.client_type}
                        </option>
                      );
                    })}
                </select>
                {clientTypeIdInputHasError && (
                  <p className="text-danger">ClientType must not be empty!!</p>
                )}
                {clientState.error && (
                  <p className="text-danger">{errors.clientTypeId}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-5">
              <div className="form-group mt-3">
                <label htmlFor="client_admin_email">Client Admin Email</label>
                {/* <input type="email" name="client_admin_email" id="client_admin_email" className='form-control' /> */}
                {adminEmails.map((emailInput, idx) => {
                  return (
                    <div key={idx} className="d-flex mt-2">
                      <input
                        type="email"
                        name="client_admin_email"
                        id={`client_admin_email_${idx}`}
                        className="form-control"
                        value={emailInput}
                        onChange={(e) => handleClientAdminEmailChange(e, idx)}
                      />
                      <span
                        onClick={() => handleDeleteClientAdminEmail(idx)}
                        className="btn btn-danger btn-sm"
                      >
                        x
                      </span>
                    </div>
                  );
                })}
                <div>
                  <span
                    onClick={handleAddClientAdminEmail}
                    className="btn btn-warning btn-sm mt-2"
                  >
                    + Add
                  </span>
                </div>
                {errors.client_admin_email && (
                  <p className="text-danger">{errors.client_admin_email}</p>
                )}
                {errorEmailData && (
                  <p className="text-danger">{errorEmailData}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="client_avatar">Avatar</label>
                <input
                  type="file"
                  name="client_avatar"
                  id="client_avatar"
                  className="form-control"
                  onChange={handleAvatarChange}
                />
                {clientState.error && (<p className='text-danger'>{errors.client_avatar}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="boxImage mt-5 d-flex justify-content-center">
                {userAvatar ? <img src={URL.createObjectURL(userAvatar)} alt="avatar" className='img-fluid' /> : <BsPersonSquare className='fs-2'/>}
              </div>
            </div>
          </div>
          <div className="actions mt-3">
            <button disabled={!formIsValid} className="btn btn-primary btn-sm">
              Create
            </button>
            <Link to={".."} className="btn btn-info btn-sm ms-3">
              Back
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddClient