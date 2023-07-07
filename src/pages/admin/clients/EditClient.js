import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useInput from '../../../hooks/use-input';
import { getAllCities } from '../../../features/city/citySlice';
import { getClientTypes } from '../../../features/clientType/clientTypeSlice';
import { BsPersonSquare } from 'react-icons/bs';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { clientService } from '../../../features/clients/clientService';
import { toast } from 'react-toastify';
import { S3_URL } from '../../../utils/apiConfig';
import { addClientError } from '../../../features/clients/clientSlice';
import Form from 'react-bootstrap/Form';

const EditClient = () => {

  let formIsValid = false;
  const params = useParams();
  const dispatch = useDispatch();
  const cityState = useSelector((state) => state.city);
  const clientState = useSelector((state) => state.client);
  const clientTypeState = useSelector((state) => state.clientType);
  const isNotEmpty = value => value.trim() !== "";
  const checkInteger = value => Number.isInteger(parseInt(value));
  const isPhoneNo = value => value.length <= 10 && value.length >= 8;
  const navigate = useNavigate();
  const [userAvatar, setUserAvatar] = useState('');
  const [oldUserAvatar, setOldUserAvatar] = useState('');
  const [active, setActive] = useState(false);

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurhandler: nameBlurHandler,
    oldValue: oldClientName
  } = useInput(isNotEmpty);
  const {
    value: enteredPhoneNo,
    isValid: enteredPhoneNoIsValid,
    hasError: phoneNoInputHasError,
    valueChangeHandler: phoneNoChangeHandler,
    inputBlurhandler: phoneNoBlurHandler,
    oldValue: oldPhoneNo
  } = useInput(isPhoneNo);
  const {
    value: enteredNoOfProperties,
    isValid: enteredNoOfPropertiesIsValid,
    hasError: noOfPropertiesInputHasError,
    valueChangeHandler: noOfPropertiesChangeHandler,
    inputBlurhandler: noOfPropertiesBlurHandler,
    oldValue: oldNoOfProperties
  } = useInput(checkInteger);
  const {
    value: enteredAddress,
    isValid: enteredAddressIsValid,
    hasError: addressInputHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurhandler: addressBlurHandler,
    oldValue: oldAddress
  } = useInput(isNotEmpty);
  const {
      value: enteredCityId,
      isValid: enteredCityIdIsValid,
      hasError: cityIdInputHasError,
      valueChangeHandler: cityIdChangeHandler,
      inputBlurhandler: cityIdBlurHandler,
      oldValue: oldCityId
  } = useInput(checkInteger);
  const {
      value: enteredClientTypeId,
      isValid: enteredClientTypeIdIsValid,
      hasError: clientTypeIdInputHasError,
      valueChangeHandler: clientTypeIdChangeHandler,
      inputBlurhandler: clientTypeIdBlurHandler,
      oldValue: oldClientTypeId
  } = useInput(checkInteger);

  useEffect(() => {
    getClient();
    dispatch(getAllCities());
    dispatch(getClientTypes());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const getClient = async () => {
    try {
      const result = await clientService.getClientById(params.id);
      oldClientName(result.client.client_name);
      oldPhoneNo(result.client.client_phone_no);
      result.client.cityId && oldCityId(result.client.cityId);
      oldClientTypeId(result.client.clientTypeId);
      oldNoOfProperties(result.client.no_of_properties);
      result.client.address && oldAddress(result.client.address);
      setOldUserAvatar(result.client.client_avatar);
      setActive(result.client.active);
    } catch (e) {
      const result = apiErrorHandler(e);
      if(!result.status){
        toast.warn(result.message);
        navigate("..");
      }
    }
  }

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

  const handleAvatarChange = (e) => {
    // console.log(e.target.files[0]);
    // console.log(e.target.files);
    setUserAvatar(e.target.files[0])
  }

  
  const handleClientUpdate = (e) => {
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

    clientObj.append('id', params.id);
    clientObj.append('client_name', enteredName);
    clientObj.append('client_phone_no', enteredPhoneNo);
    clientObj.append('cityId', enteredCityId);
    clientObj.append('clientTypeId', enteredClientTypeId);
    clientObj.append('no_of_properties', enteredNoOfProperties);
    clientObj.append('active', active);
    userAvatar && clientObj.append('client_avatar', userAvatar);
    enteredAddress && clientObj.append('address', enteredAddress);

    updateClient(clientObj);
  }

  const updateClient = async (clientData) => {
    try {
      const result = await clientService.updateClientById(clientData);
      if(result.status){
        toast.success(result.message);
        navigate("..")
      }
    } catch (err) {
      const result = apiErrorHandler(err);
      
      if(!result.status) {
          dispatch(addClientError(result.error));
          toast.warning(result.message);
      }
    }
  }

  const handleClientStatus = () => {
    setActive(() => {
        return !active;
    })
}

  return (
    <>
      <Meta title="Edit Client" />
      <h3>Edit Client</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handleClientUpdate}>
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
                {clientState.error && (
                  <p className="text-danger">{errors.client_avatar}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="boxImage mt-5 d-flex justify-content-center">
                {oldUserAvatar && !userAvatar && (
                  <img src={`${S3_URL + oldUserAvatar}`} alt="avatar" />
                )}
                {userAvatar && (
                  <img
                    src={URL.createObjectURL(userAvatar)}
                    alt="avatar"
                    className="img-fluid"
                  />
                )}{" "}
                {!oldUserAvatar && !userAvatar && (
                  <BsPersonSquare className="fs-2" />
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <Form.Check
                  type="switch"
                  checked={active}
                  label="Status"
                  id="status"
                  className='mt-3'
                  onChange={handleClientStatus}
                />
              </div>
            </div>
          </div>
          <div className="actions mt-3">
            <button disabled={!formIsValid} className="btn btn-primary btn-sm">
              Update
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

export default EditClient