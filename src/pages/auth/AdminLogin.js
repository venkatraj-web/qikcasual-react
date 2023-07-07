import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useRouteLoaderData } from 'react-router-dom'
import Container from '../../utils/Container';
import useInput from '../../hooks/use-input';
import Meta from '../../utils/Meta';
import { adminLogin, managerLogin } from '../../features/admin/auth/adminAuthSlice';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const AdminLogin = () => {

    const token = useRouteLoaderData("admin");
    const navigate = useNavigate();
    const adminAuthState = useSelector((state) => state.adminAuth);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('admin');

    useEffect(() => {
      if(adminAuthState.isSuccess){
        navigate("/admin");
        return;
      }

      if(token){
        navigate("/admin");
        return;
      }

      if(token !== "EXPIRED"){
        navigate("/admin");
        return;
      }
    },[token, navigate, adminAuthState]);

    const dispatch = useDispatch();

    const isNotEmpty = value => value.trim() !== '';
    const isEmail = value => value.includes('@');
    const errors = { email: "", password: "" };

    const {
        value: enteredEmail,
        hasError: emailInputHasError,
        isValid: enteredEmailIsValid,
        valueChangeHandler: emailChangeHandler,
        inputBlurhandler: emailBlurHandler,
        // reset: resetEmailInput
    } = useInput(isEmail);

    const {
        value: enteredPassword,
        isValid: enteredPasswordIsValid,
        hasError: passwordInputHasError,
        inputBlurhandler: passwordBlurHandler,
        valueChangeHandler: passwordChangeHandler,
        // reset: resetPasswordInput
    } = useInput(isNotEmpty);

    let formIsValid = false;

    if(enteredEmailIsValid && enteredPasswordIsValid){
        formIsValid = true;
    }

    if(adminAuthState.error){
      for(let key in errors){
        if(adminAuthState.error.hasOwnProperty("error") && Array.isArray(adminAuthState.error.error)){
          for(let errData of adminAuthState.error.error){
            if(key === errData.param && errors[key] === "" ){
              errors[key] = errData.msg;
            }
          }
        }
      }
    }

    const handleLogin = (e) => {
        e.preventDefault();

        if(!enteredEmailIsValid && !enteredPasswordIsValid){
            return;
        }

        const adminData = {
          email: enteredEmail,
          password: enteredPassword
        };
        if(role === 'admin'){
          dispatch(adminLogin(adminData));
        }else{
          dispatch(managerLogin(adminData));
        }

        // resetEmailInput();
        // resetPasswordInput();
    }

    const changeRole = () => {
      setRole(prev => {
        // console.log(prev);
        return prev === 'admin' ? 'client' : 'admin'
      })
    }

  return (
    <>
      <Meta title="Admin Login" />
      <Container class1="adminLogin-wrapper py-5 home-wrapper-2">
        <div className="login-wrapper py-3 home-wrapper-2">
          <div className="row">
            <div className="col-12">
              <div className="adminLoginForm">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-3">{role === 'admin' ? 'Admin Login' : 'Client Login' }</h3>
                  <span onClick={changeRole} className='btn btn-primary btn-sm text-white'>{role === 'client' ? 'Admin Login' : 'Client Login' }</span>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="form-group my-2">
                    <label htmlFor="email">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      name='email'
                      id='email'
                      placeholder="email"
                      onChange={emailChangeHandler}
                      onBlur={emailBlurHandler}
                      value={enteredEmail}
                    />
                    {emailInputHasError && (
                        <p className='text-danger'>Email must not be Empty</p>
                    )}
                    {adminAuthState.error && (
                      <p className='text-danger'>{errors.email}</p>
                    )}
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="password">Password</label>
                    <div className="d-flex align-items-center gap-10">
                    <input
                      type={!showPassword ? "password" : "text"}
                      className="form-control"
                      name='password'
                      id='password'
                      placeholder="password"
                      onChange={passwordChangeHandler}
                      onBlur={passwordBlurHandler}
                      value={enteredPassword}
                    />
                    { showPassword ? <BsEye onClick={() => setShowPassword(false)} className='fs-5'/> : <BsEyeSlash onClick={() => setShowPassword(true)} className='fs-5'/> }
                    </div>
                    { passwordInputHasError && (
                        <p className="text-danger">Password must not be empty</p>
                    )}
                    {adminAuthState.error && (
                      <p className='text-danger'>{errors.password}</p>
                    )}
                  </div>
                  <Link to="/admin/forgot-password">Forgot Password</Link>
                  <div className="mt-3 d-flex flex-column justify-content-center align-items-center gap-15">
                    <button type="submit" disabled={!formIsValid} className="button border-0">
                      Submit
                    </button>
                    <Link to="/">Cancel</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default AdminLogin