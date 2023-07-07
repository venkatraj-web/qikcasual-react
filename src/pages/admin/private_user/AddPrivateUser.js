import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import useInput from '../../../hooks/use-input';
import { BsPersonSquare } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { privatUserService } from '../../../features/privateUser/privateUserService';
import { addPrivateUserErrors, removePrivateUserErrors } from '../../../features/privateUser/privateUserSlice';
import { getRolesByAuthRole } from '../../../utils/auth';
import { getAllCities } from '../../../features/city/citySlice';

const AddPrivateUser = () => {

    const isNotEmpty = value => value.trim() !== "";
    const isEmail = value => value.includes('@');
    const isPhoneNo = value => value.length <= 10 && value.length >= 8;
    const dispatch = useDispatch();
    const cityState = useSelector((state) => state.city);
    const privateUserState = useSelector((state) => state.privateUser);
    const adminAuthState = useSelector((state) => state.adminAuth);
    let formIsValid = false;
    const navigate = useNavigate();
    let roles = [];

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
        value: enteredPassword,
        isValid: enteredPasswordIsValid,
        hasError: passwordInputHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurhandler: passwordBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredPasswordConfirm,
        isValid: enteredPasswordConfirmIsValid,
        hasError: passwordConfirmInputHasError,
        valueChangeHandler: passwordConfirmChangeHandler,
        inputBlurhandler: passwordConfirmBlurHandler
    } = useInput(isNotEmpty);
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

    useEffect(() => {
      dispatch(getAllCities());
      dispatch(removePrivateUserErrors());
    }, [dispatch]);

    if (
      enteredFirstNameIsValid &&
      enteredLastNameIsValid &&
      enteredEmailIsValid &&
      enteredPasswordIsValid &&
      enteredPasswordConfirmIsValid &&
      enteredCityIdIsValid &&
      enteredPhoneNoIsValid &&
      enteredRoleIsValid &&
      enteredDateOfBirthIsValid
    ) {
      formIsValid = true;
    }

    const errors = {
      user_first_name: "",
      user_last_name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      cityId: "",
      user_phone_no: "",
      role: "",
      date_of_birth: "",
      private_user_avatar: "",
    };

    if(privateUserState.error){
      for(let key in errors) {
        if(Array.isArray(privateUserState.error)){
          for(let errData of privateUserState.error){
            if(key === errData.param && errors[key] === ""){
              errors[key] = errData.msg;
            }
          }
        }
      }
    }

    // const checkErrors = (result) => {
    //   for(let key in errors) {
    //     if(Array.isArray(result.error)){
    //       for(let errData of result.error){
    //         if(key === errData.param && errors[key] === ""){
    //           errors[key] = errData.msg;
    //         }
    //       }
    //     }
    //   }
    //   console.log(errors.email);
    // }

    const storePrivateUser = async (userData) => {
      try{
        const result = await privatUserService.storePrivateUserToServer(userData);
        // console.log("Success-result");
        // console.log(result);
        if(result.status){
          toast.success(result.message);
          navigate("..");
        }
      }catch(e){
        const result = apiErrorHandler(e);
        // console.log("Error-result");
        // console.log(result);
        // checkErrors(result)
        dispatch(addPrivateUserErrors(result.error));
        toast.warning(result.message);
      }
    }

    const handleAvatarChange = (e) => {
      // console.log(e.target.files[0]);
      // console.log(e.target.files);
      setUserAvatar(e.target.files[0])
    }

    const handlePrivateUserCreate = (e) => {
      e.preventDefault();

      if (
        !enteredFirstNameIsValid &&
        !enteredLastNameIsValid &&
        !enteredEmailIsValid &&
        !enteredPasswordIsValid &&
        !enteredPasswordConfirmIsValid &&
        !enteredCityIdIsValid &&
        !enteredPhoneNoIsValid &&
        !enteredRoleIsValid
      ) {
        return;
      }

      // const userData = {
      //   user_first_name: enteredFirstName,
      //   user_last_name: enteredLastName,
      //   email: enteredEmail,
      //   password: enteredPassword,
      //   passwordConfirmation: enteredPasswordConfirm,
      //   cityId: enteredCityId,
      //   role: enteredRole,
      //   user_phone_no: enteredPhoneNo,
      // };
      // storePrivateUser(userData);

      const userObj = new FormData();
      userObj.append('user_first_name', enteredFirstName);
      userObj.append('user_last_name', enteredLastName);
      userObj.append('email', enteredEmail);
      userObj.append('password', enteredPassword);
      userObj.append('passwordConfirmation', enteredPasswordConfirm);
      userObj.append('cityId', enteredCityId);
      userObj.append('date_of_birth', enteredDateOfBirth);
      userObj.append('role', enteredRole);
      userObj.append('user_phone_no', enteredPhoneNo);
      userObj.append('private_user_avatar', userAvatar);
      storePrivateUser(userObj);

    }

    if(adminAuthState.user && adminAuthState.user.private_user){
      roles = getRolesByAuthRole(adminAuthState.user.private_user.role);
    }

  return (
    <>
      <Meta title="Add PrivateUser" />
      <h3>Add PrivateUser</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handlePrivateUserCreate} encType='application/form-data'>
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="user_first_name">First Name</label>
                <input
                  type="text"
                  name="user_first_name"
                  id="user_first_name"
                  value={enteredFirstName}
                  onChange={firstNameChangeHandler}
                  onBlur={firstNameBlurHandler}
                  className="form-control"
                />
                {firstNameInputHasError && (<p className='text-danger'>First Name must not be empty!!</p>)}
                {privateUserState.error && (<p className='text-danger'>{errors.user_first_name}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="user_last_name">Last Name</label>
                <input
                  type="text"
                  name="user_last_name"
                  id="user_last_name"
                  value={enteredLastName}
                  onChange={lastNameChangeHandler}
                  onBlur={lastNameBlurHandler}
                  className="form-control"
                />
                {lastNameInputHasError && (<p className='text-danger'>Last Name must not be empty!!</p>)}
                {privateUserState.error && (<p className='text-danger'>{errors.user_last_name}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={enteredEmail}
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                  className="form-control"
                />
                {emailInputHasError && (<p className='text-danger'>Email must not be empty!!</p>)}
                {privateUserState.error && (<p className='text-danger'>{errors.email}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="user_phone_no">Phone Number</label>
                <input
                  type="number"
                  name="user_phone_no"
                  id="user_phone_no"
                  value={enteredPhoneNo}
                  onChange={phoneNoChangeHandler}
                  onBlur={phoneNoBlurHandler}
                  className="form-control"
                  // max={10}
                  // min={8}
                />
                {phoneNoInputHasError && (<p className='text-danger'>PhoneNo must not be empty!!</p>)}
                {privateUserState.error && (<p className='text-danger'>{errors.user_phone_no}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group">
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
                { privateUserState.error && <span className="text-danger">{errors.date_of_birth}</span>}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="text"
                  name="password"
                  id="password"
                  value={enteredPassword}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  className="form-control"
                />
                {passwordInputHasError && (<p className='text-danger'>Password must not be empty!!</p>)}
                {privateUserState.error && (<p className='text-danger'>{errors.password}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="passwordConfirmation">Password Confirmation</label>
                <input
                  type="text"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  value={enteredPasswordConfirm}
                  onChange={passwordConfirmChangeHandler}
                  onBlur={passwordConfirmBlurHandler}
                  className="form-control"
                />
                {passwordConfirmInputHasError && (<p className='text-danger'>Password Confirmation must not be empty!!</p>)}
                {privateUserState.error && (<p className='text-danger'>{errors.passwordConfirmation}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label htmlFor="role">Roles </label>
                <select className='form-select' name='role' id='role' value={enteredRole} onChange={roleChangeHandler} onBlur={roleBlurHandler}>
                  <option value="">-- Roles --</option>
                  { roles.length && roles.map((role) => <option key={role.id} value={role.id} >{role.name}</option>) }
                </select>
                {roleInputHasError && (<p className='text-danger'>Role must not be empty!!</p>)}
                {privateUserState.error && (<p className='text-danger'>{errors.role}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label htmlFor="cityId">City</label>
                <select className='form-select' name='cityId' id='cityId' value={enteredCityId} onChange={cityIdChangeHandler} onBlur={cityIdBlurHandler}>
                  <option value="">-- City --</option>
                  { cityState.cities && cityState.cities.map((city) => {
                    return <option key={city.id} value={city.id}>{city.city_name}</option>;
                  }) }
                </select>
                {cityIdInputHasError && (<p className='text-danger'>City must not be empty!!</p>)}
                {privateUserState.error && (<p className='text-danger'>{errors.cityId}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="private_user_avatar">Avatar</label>
                <input
                  type="file"
                  name="private_user_avatar"
                  id="private_user_avatar"
                  onChange={handleAvatarChange}
                  className="form-control"
                />
                {privateUserState.error && (<p className='text-danger'>{errors.private_user_avatar}</p>)}
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

export default AddPrivateUser