import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCities } from '../../../features/city/citySlice';
import useInput from '../../../hooks/use-input';
import { Link, useNavigate } from 'react-router-dom';
import { BsPersonSquare } from 'react-icons/bs';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { casualService } from '../../../features/casuals/casualService';
import { addCasualErrors, removeCasualErrors } from '../../../features/casuals/casualsSlice';

const AddCasual = () => {

    const dispatch = useDispatch();
    const cityState = useSelector((state) => state.city);
    const casualState = useSelector((state) => state.casuals);
    const isNotEmpty = value => value.trim() !== '';
    const isEmail = value => value.includes('@');
    const isPhoneNo = value => value.length <= 10 && value.length >= 8;
    const isThaiNationalId = value => value.length === 13;
    let formIsValid = false;
    const navigate = useNavigate();

    const [userAvatar, setUserAvatar] = useState('');
    const [idCardFrontPhoto, setIdCardFrontPhoto] = useState('');
    const [idCardBackPhoto, setIdCardBackPhoto] = useState('');

    useEffect(() => {
        dispatch(getAllCities());
        dispatch(removeCasualErrors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        value: enteredPhoneNo,
        isValid: enteredPhoneNoIsValid,
        hasError: phoneNoInputHasError,
        valueChangeHandler: phoneNoChangeHandler,
        inputBlurhandler: phoneNoBlurHandler
    } = useInput(isPhoneNo);
    const {
        value: enteredEmail,
        isValid: enteredEmailIsValid,
        hasError: emailInputHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurhandler: emailBlurHandler
    } = useInput(isEmail);
    const {
        value: enteredThaiNationalId,
        isValid: enteredThaiNationalIdIsValid,
        hasError: thaiNationalIdInputHasError,
        valueChangeHandler: thaiNationalIdChangeHandler,
        inputBlurhandler: thaiNationalIdBlurHandler
    } = useInput(isThaiNationalId);
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

    if (
      enteredFirstNameIsValid &&
      enteredLastNameIsValid &&
      enteredPhoneNoIsValid &&
      enteredEmailIsValid && 
      enteredThaiNationalIdIsValid &&
      enteredCityIdIsValid &&
      enteredDateOfBirthIsValid
    ) {
      formIsValid = true;
    }

    const errors = {
        casual_first_name: "",
        casual_last_name: "",
        casual_phone_no: "",
        email: "",
        cityId: "",
        casual_avatar: "",
        id_card_front_photo: "",
        id_card_back_photo: "",
        date_of_birth: "",
        thaiNationalId: "",
    }

    if(casualState.error) {
        for(let key in errors){
            if(Array.isArray(casualState.error)){
                for(let errData of casualState.error){
                    if(key === errData.param && errors[key] === ""){
                        errors[key] = errData.msg;
                    }
                }
            }
        }
    }

    const handleImageChange = (e) => {
        // console.log(e.target.name);
        if(e.target.name === "casual_avatar"){
            setUserAvatar(e.target.files[0]);
        } else if(e.target.name === "id_card_front_photo"){
            setIdCardFrontPhoto(e.target.files[0]);
        } else if(e.target.name === "id_card_back_photo"){
            setIdCardBackPhoto(e.target.files[0]);
        }
    }

    const storeCasual = async (userData) => {
        try{
            const result = await casualService.storeCasual(userData);
            if(result.status){
                toast.success(result.message);
                navigate("..");
            }
        } catch (e){
            const result = apiErrorHandler(e);
            dispatch(addCasualErrors(result.error));
            toast.warning(result.message);
        }
    }

    const handleCasualCreate = (e) => {
        e.preventDefault();

        if (
          !enteredFirstNameIsValid &&
          !enteredLastNameIsValid &&
          !enteredPhoneNoIsValid &&
          !enteredCityIdIsValid &&
          !enteredDateOfBirthIsValid &&
          !enteredEmailIsValid &&
          !enteredThaiNationalIdIsValid
        ) {
            return ;
        }

        const userDataObj = new FormData();
        userDataObj.append('casual_first_name', enteredFirstName);
        userDataObj.append('casual_last_name', enteredLastName);
        userDataObj.append('email', enteredEmail);
        userDataObj.append('casual_phone_no', enteredPhoneNo);
        userDataObj.append('cityId', enteredCityId);
        userDataObj.append('date_of_birth', enteredDateOfBirth);
        userDataObj.append('thaiNationalId', enteredThaiNationalId);
        userDataObj.append('casual_avatar', userAvatar);
        userDataObj.append('id_card_front_photo', idCardFrontPhoto);
        userDataObj.append('id_card_back_photo', idCardBackPhoto);

        storeCasual(userDataObj);
    }

  return (
    <>
      <Meta title={"Add Casual"} />
      <h3>Add Casual</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handleCasualCreate}>
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="casual_first_name">First Name</label>
                <input
                  type="text"
                  name="casual_first_name"
                  id="casual_first_name"
                  className="form-control"
                  value={enteredFirstName}
                  onChange={firstNameChangeHandler}
                  onBlur={firstNameBlurHandler}
                />
                {firstNameInputHasError && (
                  <span className="text-danger">
                    First Name must not be empty!!
                  </span>
                )}
                { casualState.error && <span className="text-danger">{errors.casual_first_name}</span>}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="casual_last_name">Last Name</label>
                <input
                  type="text"
                  name="casual_last_name"
                  id="casual_last_name"
                  className="form-control"
                  value={enteredLastName}
                  onChange={lastNameChangeHandler}
                  onBlur={lastNameBlurHandler}
                />
                {lastNameInputHasError && (
                  <span className="text-danger">
                    Last Name must not be empty!!
                  </span>
                )}
                { casualState.error && <span className="text-danger">{errors.casual_last_name}</span>}
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="form-group">
                <label htmlFor="casual_phone_no">Phone Number</label>
                <input
                  type="number"
                  name="casual_phone_no"
                  id="casual_phone_no"
                  className="form-control"
                  value={enteredPhoneNo}
                  onChange={phoneNoChangeHandler}
                  onBlur={phoneNoBlurHandler}
                />
                {phoneNoInputHasError && (
                  <span className="text-danger">
                    Phone No must not be empty!!
                  </span>
                )}
                { casualState.error && <span className="text-danger">{errors.casual_phone_no}</span>}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group">
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
                {emailInputHasError && (
                  <span className="text-danger">Email must not be empty!!</span>
                )}
                { casualState.error && <span className="text-danger">{errors.email}</span>}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group">
                <label htmlFor="thaiNationalId">Thai NationalId</label>
                <input
                  type="number"
                  name="thaiNationalId"
                  id="thaiNationalId"
                  className="form-control"
                  value={enteredThaiNationalId}
                  onChange={thaiNationalIdChangeHandler}
                  onBlur={thaiNationalIdBlurHandler}
                />
                {thaiNationalIdInputHasError && (
                  <span className="text-danger">
                    Thai NationalId must not be empty!!
                  </span>
                )}
                { casualState.error && <span className="text-danger">{errors.thaiNationalId}</span>}
              </div>
            </div>
            <div className="col-12 col-md-3">
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
                  <span className="text-danger">City must not be empty!!</span>
                )}
                { casualState.error && <span className="text-danger">{errors.cityId}</span>}
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
                { casualState.error && <span className="text-danger">{errors.date_of_birth}</span>}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="form-group mt-3">
                <label htmlFor="casual_avatar">Avatar</label>
                <input
                  type="file"
                  name="casual_avatar"
                  id="casual_avatar"
                  className="form-control"
                  onChange={handleImageChange}
                />
                { casualState.error && <span className="text-danger">{errors.casual_avatar}</span>}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="boxImage mt-5 d-flex justify-content-center">
                {userAvatar ? (
                  <img src={URL.createObjectURL(userAvatar)} alt="avatar" />
                ) : (
                  <BsPersonSquare className="fs-2" />
                )}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="form-group mt-3">
                <label htmlFor="id_card_front_photo">IdCard Front</label>
                <input
                  type="file"
                  name="id_card_front_photo"
                  id="id_card_front_photo"
                  className="form-control"
                  onChange={handleImageChange}
                />
                { casualState.error && <span className="text-danger">{errors.id_card_front_photo}</span>}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="boxImage mt-5 d-flex justify-content-center">
                {idCardFrontPhoto ? (
                  <img src={URL.createObjectURL(idCardFrontPhoto)} alt="idCardFrontPhoto" />
                ) : (
                  <BsPersonSquare className="fs-2" />
                )}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="form-group mt-3">
                <label htmlFor="id_card_back_photo">IdCard Back</label>
                <input
                  type="file"
                  name="id_card_back_photo"
                  id="id_card_back_photo"
                  className="form-control"
                  onChange={handleImageChange}
                />
                { casualState.error && <span className="text-danger">{errors.id_card_back_photo}</span>}
              </div>
            </div>
            <div className="col-12 col-md-2">
              <div className="boxImage mt-5 d-flex justify-content-center">
                {idCardBackPhoto ? (
                  <img src={URL.createObjectURL(idCardBackPhoto)} alt="avatar" />
                ) : (
                  <BsPersonSquare className="fs-2" />
                )}
              </div>
            </div>
          </div>
          <div className="actions mt-5">
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

export default AddCasual