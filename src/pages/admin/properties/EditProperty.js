import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../../../hooks/use-input';
import { getAllCities } from '../../../features/city/citySlice';
import { getPropertyTypes } from '../../../features/propertyType/propertyTypeSlice';
import { getAllClientsFromServer } from '../../../features/clients/clientSlice';
import { getAllPropertGradesByPropertyTypeId, removePropertyGrades } from '../../../features/propertyGrade/propertyGradeSlice';
import { BsPersonSquare } from 'react-icons/bs';
import Form from 'react-bootstrap/Form';
import { addPropertyError, removePropertyError } from '../../../features/property/propertySlice';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { propertyService } from '../../../features/property/propertyService';
import { S3_URL } from '../../../utils/apiConfig';

const EditProperty = () => {

  let formIsValid = false;
  const params = useParams();
  const dispatch = useDispatch();
  const cityState = useSelector((state) => state.city);
  const clientState = useSelector((state) => state.client);
  const propertyState = useSelector((state) => state.property);
  const propertyTypeState = useSelector((state) => state.propertyType);
  const propertyGradeState = useSelector((state) => state.propertyGrade);
  const isNotEmpty = value => value.trim() !== "";
  const checkInteger = value => Number.isInteger(parseInt(value));
  const navigate = useNavigate();

  const {
    value: enteredPropertyName,
    isValid: enteredPropertyNameIsValid,
    hasError: propertyNameInputHasError,
    valueChangeHandler: propertyNameChangeHandler,
    inputBlurhandler: propertyNameBlurHandler,
    oldValue: oldPropertyName
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
  value: enteredAddress,
  isValid: enteredAddressIsValid,
  hasError: addressInputHasError,
  valueChangeHandler: addressChangeHandler,
  inputBlurhandler: addressBlurHandler,
  oldValue: oldAddress
} = useInput(isNotEmpty);
const {
    value: enteredClientId,
    isValid: enteredclientIdIsValid,
    hasError: clientIdInputHasError,
    valueChangeHandler: clientIdChangeHandler,
    inputBlurhandler: clientIdBlurHandler,
    oldValue: oldClientId
} = useInput(checkInteger);
const {
    value: enteredPropertyGrade,
    isValid: enteredPropertyGradeIsValid,
    hasError: propertyGradeInputHasError,
    valueChangeHandler: propertyGradeChangeHandler,
    inputBlurhandler: propertyGradeBlurHandler,
    oldValue: oldPropertyGradeId
} = useInput(checkInteger);

const [enteredPropertyType, setEnteredPropertyType] = useState("");
const [propertyAvatar, setPropertyAvatar] = useState('');
const [oldPropertyAvatar, setOldPropertyAvatar] = useState('');
const [propertyTypeIsTouched, setPropertyTypeIsTouched] = useState(false);
const [active, setActive] = useState(false);
const propertyTypeIdHasError = !checkInteger(enteredPropertyType) && propertyTypeIsTouched;

useEffect(() => {
  dispatch(getAllCities());
  dispatch(getPropertyTypes());
  dispatch(getAllClientsFromServer());
  dispatch(removePropertyError());
  dispatch(removePropertyGrades());
  getProperty();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const getProperty = async () => {
  try {
    const result = await propertyService.getPropertyById(params.id);
    oldPropertyName(result.property.property_name);
    oldClientId(result.property.clientId);
    result.property.cityId && oldCityId(result.property.cityId);
    result.property.address && oldAddress(result.property.address);
    setOldPropertyAvatar(result.property.property_avatar);
    setActive(result.property.active);
    oldPropertyGradeId(result.property.propertyGradeId);
    setEnteredPropertyType(result.property.propertyTypeId);
    handlePropertyTypeChange(result.property.propertyTypeId);
  } catch (err) {
    const result = apiErrorHandler(err);
    if(!result.status){
      toast.warn(result.message);
      navigate("..");
    }
  }
}

if (
  enteredPropertyGradeIsValid &&
  enteredCityIdIsValid &&
  // enteredAddressIsValid &&
  enteredPropertyNameIsValid &&
  enteredclientIdIsValid
) {
  formIsValid = true;
}

const errors = {
  property_name : "",
  propertyGradeId : "",
  propertyTypeId : "",
  address : "",
  cityId : "",
  clientId : "",
  property_avatar: ""
}

if(propertyState.error){
  for(let key in errors) {
    if(Array.isArray(propertyState.error)){
      for(let errData of propertyState.error){
        if(key === errData.param && errors[key] === ""){
          errors[key] = errData.msg;
        }
      }
    }
  }
}


const handlePropertyTypeChange = (propertyTypeId) => {
  // let propertyTypeId = e.target.value;
  setEnteredPropertyType(propertyTypeId);
  if(propertyTypeId){
      dispatch(getAllPropertGradesByPropertyTypeId(propertyTypeId));
  }else{
      dispatch(removePropertyGrades());
  }
}
const propertyTypeInputBlurhandler = (event) => {
  setPropertyTypeIsTouched(true);
}

const updatePropertyById = async (propertyData) => {
  try {
    const result = await propertyService.updateProperty(propertyData);
    if(result.status){
      toast.success(result.message);
      navigate("..");
    }
  } catch (err) {
    const result = apiErrorHandler(err);
    if(!result.status){
      dispatch(addPropertyError(result.error));
      toast.warning(result.message);
    }
  }
}

  const handlePropertyUpdate = (e) => {
    e.preventDefault();
    if (
        !enteredCityIdIsValid &&
        !enteredPropertyNameIsValid &&
        !enteredPropertyGradeIsValid &&
        // !enteredAddressIsValid &&
        !enteredclientIdIsValid
    ) {
        return ;
    }

    const propertyObj = new FormData();
    propertyObj.append('property_name', enteredPropertyName);
    propertyObj.append('cityId', enteredCityId);
    propertyObj.append('propertyTypeId', enteredPropertyType);
    propertyObj.append('propertyGradeId', enteredPropertyGrade);
    propertyObj.append('clientId', enteredClientId);
    propertyObj.append('id', params.id);
    propertyObj.append('active', active);
    propertyAvatar && propertyObj.append('property_avatar', propertyAvatar);
    enteredAddress && propertyObj.append('address', enteredAddress);

    updatePropertyById(propertyObj);
  }
  const handleAvatarChange = (e) => {
    setPropertyAvatar(e.target.files[0]);
  }
  
  const handleClientStatus = () => {
    setActive(() => {
        return !active;
    })
  }

  return (
    <>
      <Meta title="Edit Property" />
      <h3>Edit Property</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handlePropertyUpdate}>
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="property_name">Property Name</label>
                <input
                  type="text"
                  name="property_name"
                  id="property_name"
                  className="form-control"
                  value={enteredPropertyName}
                  onChange={propertyNameChangeHandler}
                  onBlur={propertyNameBlurHandler}
                />
                {propertyNameInputHasError && (
                  <p className="text-danger">
                    PropertyName must not be empty!!
                  </p>
                )}
                {propertyState.error && (
                  <p className="text-danger">{errors.property_name}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
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
                {propertyState.error && (
                  <p className="text-danger">{errors.cityId}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="clientId">Client</label>
                <select
                  name="clientId"
                  id="clientId"
                  className="form-select"
                  value={enteredClientId}
                  onChange={clientIdChangeHandler}
                  onBlur={clientIdBlurHandler}
                >
                  <option value="">-- Client --</option>
                  {clientState.clients &&
                    clientState.clients.map((client) => {
                      return (
                        <option key={client.id} value={client.id}>
                          {client.client_name}
                        </option>
                      );
                    })}
                </select>
                {clientIdInputHasError && (
                  <p className="text-danger">Client must not be empty!!</p>
                )}
                {propertyState.error && (
                  <p className="text-danger">{errors.clientId}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="propertyTypeId">Property Type</label>
                <select
                  name="propertyTypeId"
                  id="propertyTypeId"
                  className="form-select"
                  value={enteredPropertyType}
                  onChange={(e) => handlePropertyTypeChange(e.target.value)}
                  onBlur={propertyTypeInputBlurhandler}
                >
                  <option value="">-- PropertyType --</option>
                  {propertyTypeState.propertyTypes &&
                    propertyTypeState.propertyTypes.map((propertyType) => {
                      return (
                        <option key={propertyType.id} value={propertyType.id}>
                          {propertyType.property_type}
                        </option>
                      );
                    })}
                </select>
                {propertyTypeIdHasError && (
                  <p className="text-danger">
                    PropertyType must not be empty!!
                  </p>
                )}
                {propertyState.error && (
                  <p className="text-danger">{errors.propertyTypeId}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="propertyGradeId">Property Grade</label>
                <select
                  name="propertyGradeId"
                  id="propertyGradeId"
                  className="form-select"
                  value={enteredPropertyGrade}
                  onChange={propertyGradeChangeHandler}
                  onBlur={propertyGradeBlurHandler}
                >
                  <option value="">-- PropertyGrade --</option>
                  {propertyGradeState.propertyGrades &&
                    propertyGradeState.propertyGrades.map((propertyGrade) => {
                      return (
                        <option key={propertyGrade.id} value={propertyGrade.id}>
                          {propertyGrade.property_grade}
                        </option>
                      );
                    })}
                </select>
                {propertyGradeInputHasError && (
                  <p className="text-danger">
                    PropertyGarde must not be empty!!
                  </p>
                )}
                {propertyState.error && (
                  <p className="text-danger">{errors.propertyGradeId}</p>
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
                {propertyState.error && (
                  <p className="text-danger">{errors.address}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="property_avatar">Avatar</label>
                <input
                  type="file"
                  name="property_avatar"
                  id="property_avatar"
                  className="form-control"
                  onChange={handleAvatarChange}
                />
                {/* {propertyState.error && (<p className='text-danger'>{errors.property_avatar}</p>)} */}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="boxImage mt-5 d-flex justify-content-center">
                { oldPropertyAvatar && !propertyAvatar && (
                  <img src={`${S3_URL+oldPropertyAvatar}`} alt="property_avatar" />
                )}
                {propertyAvatar && (
                  <img
                    src={URL.createObjectURL(propertyAvatar)}
                    alt="avatar"
                    className="img-fluid"
                  />
                )}{!oldPropertyAvatar && !propertyAvatar &&(
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
                  className="mt-3"
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

export default EditProperty