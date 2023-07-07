import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCities } from '../../../features/city/citySlice';
import { getPropertyTypes } from '../../../features/propertyType/propertyTypeSlice';
import { getAllPropertGradesByPropertyTypeId, removePropertyGrades } from '../../../features/propertyGrade/propertyGradeSlice';
import useInput from '../../../hooks/use-input';
import { Link, useNavigate } from 'react-router-dom';
import { getAllClientsFromServer } from '../../../features/clients/clientSlice';
import { BsPersonSquare } from 'react-icons/bs';
import { propertyService } from '../../../features/property/propertyService';
import { toast } from 'react-toastify';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { addPropertyError } from '../../../features/property/propertySlice';

const AddProperty = () => {

    const dispatch = useDispatch();
    const cityState = useSelector((state) => state.city);
    const clientState = useSelector((state) => state.client);
    const propertyState = useSelector((state) => state.property);
    const propertyTypeState = useSelector((state) => state.propertyType);
    const propertyGradeState = useSelector((state) => state.propertyGrade);
    const isNotEmpty = value => value.trim() !== "";
    let formIsValid = false;
    const navigate = useNavigate();

    const {
        value: enteredPropertyName,
        isValid: enteredPropertyNameIsValid,
        hasError: propertyNameInputHasError,
        valueChangeHandler: propertyNameChangeHandler,
        inputBlurhandler: propertyNameBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredCityId,
        isValid: enteredCityIdIsValid,
        hasError: cityIdInputHasError,
        valueChangeHandler: cityIdChangeHandler,
        inputBlurhandler: cityIdBlurHandler
    } = useInput(isNotEmpty);
    const {
      value: enteredAddress,
      isValid: enteredAddressIsValid,
      hasError: addressInputHasError,
      valueChangeHandler: addressChangeHandler,
      inputBlurhandler: addressBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredClientId,
        isValid: enteredclientIdIsValid,
        hasError: clientIdInputHasError,
        valueChangeHandler: clientIdChangeHandler,
        inputBlurhandler: clientIdBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredPropertyGrade,
        isValid: enteredPropertyGradeIsValid,
        hasError: propertyGradeInputHasError,
        valueChangeHandler: propertyGradeChangeHandler,
        inputBlurhandler: propertyGradeBlurHandler
    } = useInput(isNotEmpty);

    const [enteredPropertyType, setEnteredPropertyType] = useState('');
    const [propertyAvatar, setPropertyAvatar] = useState('');
    const [propertyTypeIsTouched, setPropertyTypeIsTouched] = useState(false);
    const propertyTypeIdHasError = !isNotEmpty(enteredPropertyType) && propertyTypeIsTouched;

    const [adminEmails, setAdminEmails] = useState([]);
    const [errorEmailData, setErrorEmailData] = useState();

    useEffect(() => {
        dispatch(getAllCities());
        dispatch(getPropertyTypes());
        dispatch(getAllClientsFromServer());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    property_avatar: "",
    manager_email: ""
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

  const storeProperty = async (propertyData) => {
    try {
      const result = await propertyService.addPropertyToServer(propertyData);
      if(result.status){
        toast.success(result.message);
        navigate("..");
      }
    } catch (err) {
      const result = apiErrorHandler(err);
    //   console.log(result);
      if(result.error_email_data){
        setErrorEmailData(JSON.stringify(result.error_email_data))
      }else if(result.duplicate_email_data){
        setErrorEmailData(JSON.stringify(result.duplicate_email_data))
      }
      dispatch(addPropertyError(result.error));
      toast.warning(result.message);
    }
  }
  
  const handlePropertyManagerEmailChange = (onChangeValue, idx) => {
    const inputData = [...adminEmails];
    inputData[idx] = onChangeValue.target.value;
    setAdminEmails(inputData);
    // setAdminEmails((prev) => {
    //   return [...prev, adminEmails[idx] = onChangeValue.target.value];
    // })
  }
  
  const handleDeletePropertyManagerEmail = (idx) => {
    const deleteVal = [...adminEmails];
    deleteVal.splice(idx, 1);
    setAdminEmails(deleteVal);
  }
  
  const handleAddPropertyManagerEmail = () => {
    const abc = [...adminEmails, []];
    setAdminEmails(abc);
    // setAdminEmails((prev) => {
    //   return [...prev, []];
    // })
  }

    const handlePropertyTypeChange = (e) => {
        let propertyTypeId = e.target.value;
        setEnteredPropertyType(propertyTypeId);
        if(propertyTypeId){
            dispatch(getAllPropertGradesByPropertyTypeId(e.target.value));
        }else{
            dispatch(removePropertyGrades());
        }
    }
    const propertyTypeInputBlurhandler = (event) => {
        setPropertyTypeIsTouched(true);
    }

    const handlePropertCreate = (e) => {
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
        propertyObj.append('manager_email', JSON.stringify(adminEmails));
        propertyAvatar && propertyObj.append('property_avatar', propertyAvatar);
        enteredAddress && propertyObj.append('address', enteredAddress);

        // console.log(adminEmails.length)

        storeProperty(propertyObj);
    }

    const handleAvatarChange = (e) => {
      // console.log(e.target.files[0]);
      // console.log(e.target.files);
      setPropertyAvatar(e.target.files[0]);
    }

  return (
    <>
      <Meta title="Add Property" />
      <h3>Add Property</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handlePropertCreate}>
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
                {
                  propertyState.error && (<p className='text-danger'>{errors.property_name}</p>)
                }
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
                  <p className="text-danger">
                    City must not be empty!!
                  </p>
                )}
                {
                  propertyState.error && (<p className='text-danger'>{errors.cityId}</p>)
                }
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
                  <p className="text-danger">
                    Client must not be empty!!
                  </p>
                )}
                {
                  propertyState.error && (<p className='text-danger'>{errors.clientId}</p>)
                }
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="propertyTypeId">Property Type</label>
                <select
                  name="propertyTypeId"
                  id="propertyTypeId"
                  className="form-select"
                  onChange={handlePropertyTypeChange}
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
                {
                  propertyState.error && (<p className='text-danger'>{errors.propertyTypeId}</p>)
                }
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
                {
                  propertyState.error && (<p className='text-danger'>{errors.propertyGradeId}</p>)
                }
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
            <div className="col-12 col-md-5">
              <div className="form-group mt-3">
                <label htmlFor="manager_email">Property Manager Email</label>
                {/* <input type="email" name="manager_email" id="manager_email" className='form-control' /> */}
                {adminEmails.map((emailInput, idx) => {
                  return (
                    <div key={idx} className="d-flex mt-2">
                      <input
                        type="email"
                        name="manager_email"
                        id={`manager_email_${idx}`}
                        className="form-control"
                        value={emailInput}
                        onChange={(e) => handlePropertyManagerEmailChange(e, idx)}
                      />
                      <span
                        onClick={() => handleDeletePropertyManagerEmail(idx)}
                        className="btn btn-danger btn-sm"
                      >
                        x
                      </span>
                    </div>
                  );
                })}
                <div>
                  <span
                    onClick={handleAddPropertyManagerEmail}
                    className="btn btn-warning btn-sm mt-2"
                  >
                    + Add
                  </span>
                </div>
                {errors.manager_email && (
                  <p className="text-danger">{errors.manager_email}</p>
                )}
                {errorEmailData && (
                  <p className="text-danger">{errorEmailData}</p>
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
                {propertyAvatar ? <img src={URL.createObjectURL(propertyAvatar)} alt="avatar" className='img-fluid' /> : <BsPersonSquare className='fs-2'/>}
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

export default AddProperty