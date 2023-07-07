import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsPersonSquare } from 'react-icons/bs';
import useInput from '../../../hooks/use-input';
import { getAllCities } from '../../../features/city/citySlice';
import { addManagerError, removeManagerError } from '../../../features/managers/managerSlice';
import { getAllClientsFromServer } from '../../../features/clients/clientSlice';
import { managerService } from '../../../features/managers/managerService';
import { toast } from 'react-toastify';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';

const AddManager = () => {

    const isNotEmpty = value => value.trim() !== "";
    const isEmail = value => value.includes('@');
    const isPhoneNo = value => value.length <= 10 && value.length >= 8;
    const dispatch = useDispatch();
    const cityState = useSelector((state) => state.city);
    const clientState = useSelector((state) => state.client);
    const managerState = useSelector((state) => state.manager);
    let formIsValid = false;
    const navigate = useNavigate();
    const [userAvatar, setUserAvatar] = useState('');

    const {
        value: enteredFirstName,
        isValid: enteredFirstNameIsValid,
        hasError: firstNameInputHasError,
        valueChangeHandler: firstNameChangeHandler,
        inputBlurhandler: firstNameBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredLastName,
        isValid: enteredLastNameIsValid,
        hasError: lastNameInputHasError,
        valueChangeHandler: lastNameChangeHandler,
        inputBlurhandler: lastNameBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredEmail,
        isValid: enteredEmailIsValid,
        hasError: emailInputHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurhandler: emailBlurHandler
    } = useInput(isEmail);
    const {
        value: enteredPhoneNo,
        isValid: enteredPhoneNoIsValid,
        hasError: phoneNoInputHasError,
        valueChangeHandler: phoneNoChangeHandler,
        inputBlurhandler: phoneNoBlurHandler
    } = useInput(isPhoneNo);
    const {
        value: enteredRole,
        isValid: enteredRoleIsValid,
        hasError: roleInputHasError,
        valueChangeHandler: roleChangeHandler,
        inputBlurhandler: roleBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredCityId,
        isValid: enteredCityIdIsValid,
        hasError: cityIdInputHasError,
        valueChangeHandler: cityIdChangeHandler,
        inputBlurhandler: cityIdBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredDateOfBirth,
        isValid: enteredDateOfBirthIsValid,
        hasError: dateOfBirthInputHasError,
        valueChangeHandler: dateOfBirthChangeHandler,
        inputBlurhandler: dateOfBirthBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredClientId,
        isValid: enteredClientIdIsValid,
        hasError: clientIdInputHasError,
        valueChangeHandler: clientIdChangeHandler,
        inputBlurhandler: clientIdBlurHandler
    } = useInput(isNotEmpty);

    useEffect(() => {
        dispatch(getAllCities());
        dispatch(getAllClientsFromServer());
        dispatch(removeManagerError());
      }, [dispatch]);

    const handleAvatarChange = (e) => {
      setUserAvatar(e.target.files[0]);
    }

    if (
        enteredFirstNameIsValid &&
        enteredLastNameIsValid &&
        enteredEmailIsValid &&
        enteredCityIdIsValid &&
        enteredClientIdIsValid &&
        enteredPhoneNoIsValid &&
        enteredRoleIsValid &&
        enteredDateOfBirthIsValid
      ) {
        formIsValid = true;
      }

      const errors = {
        manager_first_name: "",
        manager_last_name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        cityId: "",
        clientId: "",
        manager_phone_no: "",
        role: "",
        date_of_birth: "",
        manager_avatar: "",
      };
  
      if(managerState.error){
        for(let key in errors) {
          if(Array.isArray(managerState.error)){
            for(let errData of managerState.error){
              if(key === errData.param && errors[key] === ""){
                errors[key] = errData.msg;
              }
            }
          }
        }
      }
      
    const storeManager = async (userData) => {
        try{
          const result = await managerService.storeManageToServer(userData);
          if(result.status){
            toast.success(result.message);
            navigate("..");
          }
        }catch(e){
          const result = apiErrorHandler(e);
          dispatch(addManagerError(result.error));
          toast.warning(result.message);
        }
      }

    const handleManagerCreate = (e) => {
        e.preventDefault();

        if (
            !enteredFirstNameIsValid &&
            !enteredLastNameIsValid &&
            !enteredEmailIsValid &&
            !enteredCityIdIsValid &&
            !enteredClientIdIsValid &&
            !enteredPhoneNoIsValid &&
            !enteredRoleIsValid &&
            !enteredDateOfBirthIsValid
          ) {
            return;
          }

          const userObj = new FormData();
          userObj.append('manager_first_name', enteredFirstName);
          userObj.append('manager_last_name', enteredLastName);
          userObj.append('email', enteredEmail);
          userObj.append('cityId', enteredCityId);
          userObj.append('clientId', enteredClientId);
          userObj.append('date_of_birth', enteredDateOfBirth);
          userObj.append('role', enteredRole);
          userObj.append('manager_phone_no', enteredPhoneNo);
          userAvatar && userObj.append('manager_avatar', userAvatar);
          storeManager(userObj);
    }

  return (
    <>
      <Meta title="Add Manager" />
      <h3>Add Manager</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handleManagerCreate} encType="application/form-data">
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="manager_first_name">First Name</label>
                <input
                  type="text"
                  name="manager_first_name"
                  id="manager_first_name"
                  className="form-control"
                  value={enteredFirstName}
                  onChange={firstNameChangeHandler}
                  onBlur={firstNameBlurHandler}
                />
                {firstNameInputHasError && (<p className='text-danger'>First Name must not be empty!!</p>)}
                {managerState.error && (<p className='text-danger'>{errors.manager_first_name}</p>)}
               </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="manager_last_name">Last Name</label>
                <input
                  type="text"
                  name="manager_last_name"
                  id="manager_last_name"
                  className="form-control"
                  value={enteredLastName}
                  onChange={lastNameChangeHandler}
                  onBlur={lastNameBlurHandler}
                />
                {lastNameInputHasError && (<p className='text-danger'>Last Name must not be empty!!</p>)}
                {managerState.error && (<p className='text-danger'>{errors.manager_last_name}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  value={enteredEmail}
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                />
                {emailInputHasError && (<p className='text-danger'>Email must not be empty!!</p>)}
                {managerState.error && (<p className='text-danger'>{errors.email}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="manager_phone_no">Phone Number</label>
                <input
                  type="number"
                  name="manager_phone_no"
                  id="manager_phone_no"
                  className="form-control"
                  value={enteredPhoneNo}
                  onChange={phoneNoChangeHandler}
                  onBlur={phoneNoBlurHandler}
                />
                {phoneNoInputHasError && (<p className='text-danger'>PhoneNo must not be empty!!</p>)}
                {managerState.error && (<p className='text-danger'>{errors.manager_phone_no}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="date_of_birth">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  className="form-control"
                  value={enteredDateOfBirth}
                  onChange={dateOfBirthChangeHandler}
                  onBlur={dateOfBirthBlurHandler}
                />
                {dateOfBirthInputHasError && (
                  <span className="text-danger">DOB must not be empty!!</span>
                )}
                { managerState.error && <span className="text-danger">{errors.date_of_birth}</span>}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="cityId">City</label>
                <select name="cityId" id="cityId" className='form-select' value={enteredCityId} onChange={cityIdChangeHandler} onBlur={cityIdBlurHandler}>
                    <option value="">-- City --</option>
                  { cityState.cities && cityState.cities.map((city) => {
                    return <option key={city.id} value={city.id}>{city.city_name}</option>;
                  }) }
                </select>
                {cityIdInputHasError && (<p className='text-danger'>City must not be empty!!</p>)}
                {managerState.error && (<p className='text-danger'>{errors.cityId}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="clientId">Client</label>
                <select name="clientId" id="clientId" className='form-select' value={enteredClientId} onChange={clientIdChangeHandler} onBlur={clientIdBlurHandler}>
                    <option value="">-- Client --</option>
                    { clientState.clients && clientState.clients.map(client => {
                        return <option key={client.id} value={client.id}>{client.client_name}</option>
                    })}
                </select>
                {clientIdInputHasError && (<p className='text-danger'>Client must not be empty!!</p>)}
                {managerState.error && (<p className='text-danger'>{errors.clientId}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="role">Roles</label>
                <select name="role" id="role" className='form-select' value={enteredRole} onChange={roleChangeHandler} onBlur={roleBlurHandler}>
                    <option value="">-- Roles --</option>
                    <option value="client-admin">Client Admin</option>
                    <option value="manager">Manager</option>
                </select>
                {roleInputHasError && (<p className='text-danger'>Role must not be empty!!</p>)}
                {managerState.error && (<p className='text-danger'>{errors.role}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="manager_avatar">Avatar</label>
                <input type="file" name="manager_avatar" id="manager_avatar" className='form-control'
                  onChange={handleAvatarChange} />
                  {managerState.error && (<p className='text-danger'>{errors.manager_avatar}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="boxImage mt-5 d-flex justify-content-center">
                {userAvatar ? <img src={URL.createObjectURL(userAvatar)} alt="avatar" className='img-fluid' /> : <BsPersonSquare className='fs-2'/>}
              </div>
            </div>
          </div>
            <div className="actions mt-3">
              <button disabled={!formIsValid} className='btn btn-primary btn-sm'>Create</button>
              <Link to={".."} className='btn btn-info btn-sm ms-3'>Back</Link>
            </div>
        </form>
      </div>
    </>
  );
}

export default AddManager