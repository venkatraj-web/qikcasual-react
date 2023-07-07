import React, { useEffect } from 'react'
import useInput from '../../hooks/use-input';
import Meta from '../../utils/Meta';
import Container from '../../utils/Container';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminForgotPassword, removeAdminError } from '../../features/admin/auth/adminAuthSlice';

const ForgotPassword = () => {
    const isEmail = value => value.includes('@');
    const errors = { email: ""};
    const adminAuthState = useSelector((state) => state.adminAuth);
    const dispatch = useDispatch();

    const {
        value: enteredEmail,
        hasError: emailInputHasError,
        isValid: enteredEmailIsValid,
        valueChangeHandler: emailChangeHandler,
        inputBlurhandler: emailBlurHandler,
        reset: resetEmailInput
    } = useInput(isEmail);

    let formIsValid = false;

    if(enteredEmailIsValid){
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

    useEffect(() => {
        dispatch(removeAdminError());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleForgotPassword = (e) => {
        e.preventDefault();

        if(!enteredEmailIsValid){
            return;
        }

        const adminData = {
          email: enteredEmail
        };

        dispatch(adminForgotPassword(adminData));

        resetEmailInput();
        // resetPasswordInput();
    }

  return (
    <>
      <Meta title="ForgotPassword" />
      <Container class1="adminLogin-wrapper py-5 home-wrapper-2">
        <div className="login-wrapper py-3 ">
          <div className="row">
            <div className="col-12">
              <div className="adminLoginForm">
                <h3 className="text-center mb-3">Forgot Password</h3>
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group my-2">
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
                    { emailInputHasError && (
                        <p className='text-danger'>Email must not be empty!!</p>
                    )}
                    
                    {adminAuthState.error && (
                      <p className='text-danger'>{errors.email}</p>
                    )}
                  </div>
                  <div className="form-group my-2">
                  <div className="mt-3 d-flex flex-column justify-content-center align-items-center gap-15">
                    <button type="submit" disabled={!formIsValid} className="button border-0">
                      Submit
                    </button>
                    <Link to="/admin/login">Back</Link>
                  </div>
                  </div>
                </form>
                
                { adminAuthState.isSuccess && (
                    <p className='text-success text-center'>{adminAuthState.message}</p>
                )}
                { adminAuthState.isError && (
                    <p className='text-danger text-center'>{adminAuthState.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default ForgotPassword