import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Meta from '../../../utils/Meta';
import useInput from '../../../hooks/use-input';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { privatUserService } from '../../../features/privateUser/privateUserService';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCities } from '../../../features/city/citySlice';
import { BsPersonSquare } from 'react-icons/bs'
import { S3_URL } from '../../../utils/apiConfig';
import { getAdminProfile } from '../../../features/admin/auth/adminAuthSlice';
import Form from 'react-bootstrap/Form';
import { getRolesByAuthRole } from '../../../utils/auth';
import { addPrivateUserErrors, removePrivateUserErrors } from '../../../features/privateUser/privateUserSlice';

const EditPrivateUser = () => {
    const params = useParams();
    let formIsValid = false;
    const isNotEmpty = value => value.trim() !== "";
    const isPhoneNo = value => value.length >= 8 && value.length <= 10;
    const isEmail = value => value.includes('@');
    const checkInteger = value => Number.isInteger(parseInt(value));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cityState = useSelector((state) => state.city);
    const adminAuthState = useSelector((state) => state.adminAuth);
    const privateUserState = useSelector((state) => state.privateUser);
    const [userAvatar, setUserAvatar] = useState('');
    const [oldUserAvatar, setOldUserAvatar] = useState('');
    const [active, setActive] = useState(false);
    let roles = [];

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
    } = useInput(isEmail);
    const {
        value: enteredPhoneNo,
        isValid: enteredPhoneNoIsValid,
        hasError: phoneNoInputHasError,
        valueChangeHandler: phoneNoChangeHandler,
        inputBlurhandler: phoneNoBlurHandler,
        oldValue: oldPhoneNo
    } = useInput(isPhoneNo);
    const {
        value: enteredCityId,
        isValid: enteredCityIdIsValid,
        hasError: cityIdInputHasError,
        valueChangeHandler: cityIdChangeHandler,
        inputBlurhandler: cityIdBlurHandler,
        oldValue: oldCityId
    } = useInput(checkInteger);
    const {
        value: enteredRole,
        isValid: enteredRoleIsValid,
        hasError: roleInputHasError,
        valueChangeHandler: roleChangeHandler,
        inputBlurhandler: roleBlurHandler,
        oldValue: oldRole
    } = useInput(isNotEmpty);
    const {
        value: enteredDateOfBirth,
        isValid: enteredDateOfBirthIsValid,
        hasError: dateOfBirthInputHasError,
        valueChangeHandler: dateOfBirthChangeHandler,
        inputBlurhandler: dateOfBirthBlurHandler,
        oldValue: oldDateOfBirth
    } = useInput(isNotEmpty);
    
    useEffect(() => {
        getPrivateUser();
        dispatch(getAllCities());
        dispatch(getAdminProfile());
        dispatch(removePrivateUserErrors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dispatch]);

    const getPrivateUser = async () => {
        try{
            const result = await privatUserService.getPrivateUserById(params.id);
            // console.log(result.private_user);
            const user = result.private_user;
            oldFirstName(user.user_first_name);
            oldLastName(user.user_last_name);
            oldEmail(user.email);
            oldPhoneNo(user.user_phone_no);
            user.date_of_birth && oldDateOfBirth(user.date_of_birth);
            oldCityId(user.cityId ? user.cityId : "");
            oldRole(user.role);
            setOldUserAvatar(user.private_user_avatar);
            setActive(user.active);
        }catch(e){
            const result = apiErrorHandler(e);
            // console.log(result);
            if(!result.status){
                toast.warn(result.message);
                navigate("..")
            }
        }
    }

    if (
      enteredFirstNameIsValid &&
      enteredLastNameIsValid &&
      enteredPhoneNoIsValid &&
      enteredEmailIsValid && 
      enteredCityIdIsValid &&
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
      date_of_birth: "",
      role: "",
      private_user_avatar: "",
    }
    
    if(privateUserState.error){
      for(let key in errors){
        if(Array.isArray(privateUserState.error)){
          for(let errData of privateUserState.error){
            if(key === errData.param && errors[key] === ""){
              errors[key] = errData.msg;
            }
          }
        }
      }
    }

    const handleAvatarChage = (e) => {
        setUserAvatar(e.target.files[0]);
    }


    const handlePrivateUserUpdate = (e) => {
        e.preventDefault();

        if (
            !enteredFirstNameIsValid &&
            !enteredLastNameIsValid &&
            !enteredPhoneNoIsValid &&
            !enteredCityIdIsValid &&
            !enteredEmailIsValid && 
            !enteredDateOfBirthIsValid &&
            !enteredRoleIsValid
          ) {
            return ;
          }

          const userObj = new FormData();
          userObj.append('user_first_name', enteredFirstName);
          userObj.append('user_last_name', enteredLastName);
          // userObj.append('email', enteredEmail);
          userObj.append('user_phone_no', enteredPhoneNo);
          userObj.append('cityId', enteredCityId);
          // userObj.append('date_of_birth', enteredDateOfBirth);
          userObj.append('role', enteredRole);
          userObj.append('active', active);
          userAvatar && userObj.append('private_user_avatar', userAvatar);
          userObj.append("id", params.id);

          updatePrivateUser(userObj);

    }

    const updatePrivateUser = async (userData) => {
        try {
            const result = await privatUserService.updatePrivateUserById(userData);
            if(result.status){
                toast.success(result.message);
                navigate("..")
            }
        } catch (err) {
            const result = apiErrorHandler(err);
            
            if(!result.status) {
                dispatch(addPrivateUserErrors(result.error));
                toast.warning(result.message);
            }
        }
    }
    if(adminAuthState.user && adminAuthState.user.private_user){
        roles = getRolesByAuthRole(adminAuthState.user.private_user.role);
    }

    // console.log(roles);
    
  
  const handleClientStatus = () => {
    setActive(() => {
        return !active;
    })
  }

  return (
    <>
      <Meta title="Edit PrivateUser" />
      <h3>Edit PrivateUser</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handlePrivateUserUpdate}>
          <div className="row">
            <div className="col-12 col-md-3">
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
                  <p className="text-danger">First Name must not be empty!</p>
                )}
                { privateUserState.error && (<p className='text-danger'>{errors.user_first_name}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
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
                  <p className="text-danger">Last Name must not be empty!</p>
                )}
                {privateUserState.error && (<p className='text-danger'>{errors.user_last_name}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  readOnly
                  className="form-control"
                  value={enteredEmail}
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                />
                {emailInputHasError && (
                  <span className="text-danger">Email must not be empty!!</span>
                )}
                {privateUserState.error && (
                  <span className="text-danger">{errors.email}</span>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="date_of_birth">Date of Birth</label>
                <input
                  type="date"
                  readOnly
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
                {privateUserState.error && (
                  <span className="text-danger">{errors.date_of_birth}</span>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="cityId">City</label>
                <select
                  name="cityId"
                  id="cityId"
                  value={enteredCityId}
                  onChange={cityIdChangeHandler}
                  onBlur={cityIdBlurHandler}
                  className="form-select"
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
                  <p className="text-danger">City must not be empty!</p>
                )}
                {privateUserState.error && (<p className='text-danger'>{errors.cityId}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="role">Role</label>
                <select
                  name="role"
                  id="role"
                  value={enteredRole}
                  onChange={roleChangeHandler}
                  onBlur={roleBlurHandler}
                  className="form-select"
                >
                  <option value="">-- Roles --</option>
                  { roles.length && roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                </select>
                {roleInputHasError && (
                  <p className="text-danger">Role must not be empty!</p>
                )}
                {privateUserState.error && (<p className='text-danger'>{errors.role}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="form-group mt-3">
                <label htmlFor="user_phone_no">Phone Number</label>
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
                  <p className="text-danger">Phone Number must not be empty!</p>
                )}
                {privateUserState.error && (<p className='text-danger'>{errors.user_phone_no}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="form-group mt-3">
                <label htmlFor="private_user_avatar">Avatar</label>
                <input
                  type="file"
                  name="private_user_avatar"
                  id="private_user_avatar"
                  className="form-control"
                  onChange={handleAvatarChage}
                />
                {privateUserState.error && (<p className='text-danger'>{errors.private_user_avatar}</p>)}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="boxImage mt-5 d-flex justify-content-center">
                { oldUserAvatar && !userAvatar && (
                    <img
                    src={`${S3_URL + oldUserAvatar}`}
                    alt="avatar"
                    className="img-fluid"
                  />
                )}
                { userAvatar && (
                    <img
                      src={URL.createObjectURL(userAvatar)}
                      alt="avatar"
                      className="img-fluid"
                    />
                  )}
                { !oldUserAvatar && !userAvatar && (
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
            <Link to={".."} className="btn btn-info btn-sm ms-2">
              Back
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditPrivateUser