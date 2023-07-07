import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import { Link, useNavigate } from 'react-router-dom'
import { BsPersonSquare } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCities } from '../../../features/city/citySlice'
import useInput from '../../../hooks/use-input'
import { apiErrorHandler } from '../../../utils/apiErrorHandler'
import { toast } from 'react-toastify'
import { adminAuthService } from '../../../features/admin/auth/adminAuthService'
import { S3_URL } from '../../../utils/apiConfig'
import { privatUserService } from '../../../features/privateUser/privateUserService'
import { addAdminError } from '../../../features/admin/auth/adminAuthSlice'
import { managerService } from '../../../features/managers/managerService'

const EditProfile = () => {

    const [avatar, setAvatar] = useState('');
    const [oldAvatar, setOldAvatar] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let formIsValid = false;

    const cityState = useSelector((state) => state.city);
    const adminAuthState = useSelector((state) => state.adminAuth);
    const isNotEmpty = value => value.trim() !== '';
    const isPhoneNo = value => value.length >= 8 && value.length <= 10;
    const checkInteger = (value) => Number.isInteger(parseInt(value));

    const {
        value: enteredFirstName,
        isValid: enteredFirstNameIsValid,
        hasError: firstNameInputHasError,
        valueChangeHandler: firstNameChangeHandler,
        inputBlurhandler: firstNameBlurHandler,
        oldValue: oldFirstName
    } = useInput(isNotEmpty);
    const {
        value: enteredLastName,
        isValid: enteredLastNameIsValid,
        hasError: lastNameInputHasError,
        valueChangeHandler: lastNameChangeHandler,
        inputBlurhandler: lastNameBlurHandler,
        oldValue: oldLastName
    } = useInput(isNotEmpty);
    const {
        value: enteredEmail,
        isValid: enteredEmailIsValid,
        hasError: emailInputHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurhandler: emailBlurHandler,
        oldValue: oldEmail
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
        value: enteredDateOfBirth,
        isValid: enteredDateOfBirthIsValid,
        hasError: dateOfBirthInputHasError,
        valueChangeHandler: dateOfBirthChangeHandler,
        inputBlurhandler: dateOfBirthBlurHandler,
        oldValue: oldDateOfBirth
    } = useInput(isNotEmpty);
    const {
        value: enteredCityId,
        isValid: enteredCityIdIsValid,
        hasError: cityIdInputHasError,
        valueChangeHandler: cityIdChangeHandler,
        inputBlurhandler: cityIdBlurHandler,
        oldValue: oldCityId
      } = useInput(checkInteger);
      
      useEffect(() => {
        dispatch(getAllCities());
        getAdminProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      
      const role = adminAuthState.user.private_user ? adminAuthState.user.private_user?.role : adminAuthState.user.manager?.role;
    const getAdminProfile = async () => {
      try {
        let result = await adminAuthService.adminProfile();
        const user = result.private_user ? result.private_user : result.manager;
        if (role === "client-admin" || role === "manager") {
          user.manager_first_name && oldFirstName(user.manager_first_name);
          user.manager_last_name && oldLastName(user.manager_last_name);
          user.manager_phone_no && oldPhoneNo(user.manager_phone_no);
          setOldAvatar(user.manager_avatar);
        } else {
          user.user_first_name && oldFirstName(user.user_first_name);
          user.user_last_name && oldLastName(user.user_last_name);
          user.user_phone_no && oldPhoneNo(user.user_phone_no);
          setOldAvatar(user.private_user_avatar);
        }
        oldEmail(user.email);
        user.date_of_birth && oldDateOfBirth(user.date_of_birth);
        oldCityId(user.cityId ? user.cityId : "");
      } catch (e) {
        const result = apiErrorHandler(e);
        if (!result.status) {
          toast.warn(result.message);
          navigate("..");
        }
      }
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    }

    if (
      enteredFirstNameIsValid &&
      enteredLastNameIsValid &&
      enteredEmailIsValid &&
      enteredPhoneNoIsValid &&
      enteredDateOfBirthIsValid &&
      enteredCityIdIsValid
    ) {
      formIsValid = true;
    }

    let errors;
    
    if(role === 'client-admin' || role === 'manager') {
      errors = {
        manager_first_name: "",
        manager_last_name: "",
        cityId: "",
        manager_phone_no: "",
        date_of_birth: "",
        manager_avatar: "",
      }
    }else{
      errors = {
        user_first_name: "",
        user_last_name: "",
        cityId: "",
        user_phone_no: "",
        date_of_birth: "",
        private_user_avatar: "",
      }
    }
    
    if(adminAuthState.error){
      for(let key in errors){
        if(Array.isArray(adminAuthState.error)){
          for(let errData of adminAuthState.error){
            if(key === errData.param && errors[key] === ""){
              errors[key] = errData.msg;
            }
          }
        }
      }
    }


    const handleProfileUpdate = (e) => {
      e.preventDefault();

      if (
        !enteredFirstNameIsValid &&
        !enteredLastNameIsValid &&
        !enteredEmailIsValid &&
        !enteredPhoneNoIsValid &&
        !enteredDateOfBirthIsValid &&
        !enteredCityIdIsValid
      ) {
        return;
      }

      const userObj = new FormData();
      if(role === 'client-admin' || role === 'manager') {
        userObj.append("manager_first_name", enteredFirstName);
        userObj.append("manager_last_name", enteredLastName);
        userObj.append("manager_phone_no", enteredPhoneNo);
        avatar && userObj.append("manager_avatar", avatar);
      } else{
        userObj.append("user_first_name", enteredFirstName);
        userObj.append("user_last_name", enteredLastName);
        userObj.append("user_phone_no", enteredPhoneNo);
        avatar && userObj.append("private_user_avatar", avatar);
      }
      userObj.append("cityId", enteredCityId);
      userObj.append("date_of_birth", enteredDateOfBirth);
      console.log(userObj);
      updatePrivateUser(userObj);
    }

    const updatePrivateUser = async (userObj) => {
      try {
        let result;
        if(role === 'client-admin' || role === 'manager') {
          console.log(role);
          result = await managerService.updateManagerProfile(userObj);
        }else{
          result = await privatUserService.updatePrivateUserProfile(userObj);
        }
        if(result.status){
          toast.success(result.message);
          navigate("..")
      }
      } catch (err) {
        const result = apiErrorHandler(err);
        if(!result.status) {
            dispatch(addAdminError(result.error));
            toast.warning(result.message);
        }
      }
    }

  return (
    <>
      <Meta title="Edit Profile" />
      <h3>Edit Profile</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handleProfileUpdate}>
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="user_first_name">First Name</label>
                <input
                  type="text"
                  name="user_first_name"
                  id="user_first_name"
                  className="form-control"
                  value={enteredFirstName}
                  onChange={firstNameChangeHandler}
                  onBlur={firstNameBlurHandler}
                />
                {firstNameInputHasError && (
                  <span className="text-danger">
                    FirstName must not be empty!
                  </span>
                )}
                { adminAuthState.error && (<p className='text-danger'>{errors.user_first_name}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="user_last_name">Last Name</label>
                <input
                  type="text"
                  name="user_last_name"
                  id="user_last_name"
                  className="form-control"
                  value={enteredLastName}
                  onChange={lastNameChangeHandler}
                  onBlur={lastNameBlurHandler}
                />
                {lastNameInputHasError && (
                  <span className="text-danger">
                    LastName must not be empty!
                  </span>
                )}
                { adminAuthState.error && (<p className='text-danger'>{errors.user_last_name}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  readOnly
                  name="email"
                  id="email"
                  className="form-control"
                  value={enteredEmail}
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                />
                {emailInputHasError && (
                  <span className="text-danger">Email must not be empty!</span>
                )}
                { adminAuthState.error && (<p className='text-danger'>{errors.email}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="user_phone_no">Phone No</label>
                <input
                  type="number"
                  name="user_phone_no"
                  id="user_phone_no"
                  className="form-control"
                  value={enteredPhoneNo}
                  onChange={phoneNoChangeHandler}
                  onBlur={phoneNoBlurHandler}
                />
                {phoneNoInputHasError && (
                  <span className="text-danger">
                    Phone Number must not be empty!
                  </span>
                )}
                { adminAuthState.error && (<p className='text-danger'>{errors.user_phone_no}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="cityId">City</label>
                <select
                  name="cityId"
                  id="cityId"
                  className="form-select"
                  onChange={cityIdChangeHandler}
                  value={enteredCityId}
                  onBlur={cityIdBlurHandler}
                >
                  <option value="">-- City --</option>
                  {cityState.cities?.map((city) => {
                    return (
                      <option value={city.id} key={city.id}>
                        {city.city_name}
                      </option>
                    );
                  })}
                </select>
                {cityIdInputHasError && (
                  <span className="text-danger">
                    City must not be empty!
                  </span>
                )}
                { adminAuthState.error && (<p className='text-danger'>{errors.cityId}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="date_of_birth">DOB</label>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  readOnly={false}
                  className="form-control"
                  value={enteredDateOfBirth}
                  onChange={dateOfBirthChangeHandler}
                  onBlur={dateOfBirthBlurHandler}
                />
                {dateOfBirthInputHasError && (
                  <span className="text-danger">DOB must not be empty!</span>
                )}
                { adminAuthState.error && (<p className='text-danger'>{errors.date_of_birth}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group mt-3">
                <label htmlFor="private_user_avatar">Avatar</label>
                <input
                  type="file"
                  name="private_user_avatar"
                  id="private_user_avatar"
                  className="form-control"
                  onChange={handleAvatarChange}
                />
                { adminAuthState.error && (<p className='text-danger'>{errors.private_user_avatar}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="boxImage mt-5 d-flex justify-content-center">
                { oldAvatar && !avatar && (
                    <img src={`${S3_URL+oldAvatar}`} alt="avatar" />
                )}
                {avatar && (
                  <img src={URL.createObjectURL(avatar)} alt="avatar" />
                )}
                {!oldAvatar && !avatar && <BsPersonSquare className="fs-2" />}
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

export default EditProfile