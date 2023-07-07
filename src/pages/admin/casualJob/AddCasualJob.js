import React, { useEffect, useState } from 'react'
import Meta from '../../../utils/Meta'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCities } from '../../../features/city/citySlice';
import { getAllClientsFromServer, getClientBasedOnManager } from '../../../features/clients/clientSlice';
import { addCasualJobError, removeCasualJobError } from '../../../features/casualJob/casualJobSlice';
import { getAllPropertiesByClientId, removeProperties } from '../../../features/property/propertySlice';
import { getJobTypes } from '../../../features/jobType/jobTypeSlice';
import useInput from '../../../hooks/use-input';
import { apiErrorHandler } from '../../../utils/apiErrorHandler';
import { toast } from 'react-toastify';
import { casualJobService } from '../../../features/casualJob/casualJobService';
import { BsTrash } from 'react-icons/bs';

const AddCasualJob = () => {

    const isNotEmpty = value => value.trim() !== "";
    const dispatch = useDispatch();
    const adminAuthState = useSelector((state) => state.adminAuth);
    const cityState = useSelector((state) => state.city);
    const clientState = useSelector((state) => state.client);
    const jobTypeState = useSelector((state) => state.jobType);
    const propertyState = useSelector((state) => state.property);
    const casualJobState = useSelector((state) => state.casualJob);
    let formIsValid = false;
    const navigate = useNavigate();
    const [enteredClientId, setEnteredClientId] = useState('');
    const [clientIdIsTouched, setClientIdIsTouched] = useState(false);
    const clientIdHasError = !isNotEmpty(enteredClientId) && clientIdIsTouched;

    const {
        value: enteredJobTitle,
        isValid: enteredJobTitleIsValid,
        hasError: jobTitleInputHasError,
        valueChangeHandler: jobTitleChangeHandler,
        inputBlurhandler: jobTitleBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredCityId,
        isValid: enteredCityIdIsValid,
        hasError: cityIdInputHasError,
        valueChangeHandler: cityIdChangeHandler,
        inputBlurhandler: cityIdBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredPropertyId,
        isValid: enteredPropertyIdIsValid,
        hasError: propertyIdInputHasError,
        valueChangeHandler: propertyIdChangeHandler,
        inputBlurhandler: propertyIdBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredJobTypeId,
        isValid: enteredJobTypeIdIsValid,
        hasError: jobTypeIdInputHasError,
        valueChangeHandler: jobTypeIdChangeHandler,
        inputBlurhandler: jobTypeIdBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredNoOfCasuals,
        isValid: enteredNoOfCasualsIsValid,
        hasError: noOfCasualsInputHasError,
        valueChangeHandler: noOfCasualsChangeHandler,
        inputBlurhandler: noOfCasualsBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredOutletName,
        isValid: enteredOutletNameIsValid,
        hasError: outletNameInputHasError,
        valueChangeHandler: outletNameChangeHandler,
        inputBlurhandler: outletNameBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredReportingPerson,
        isValid: enteredReportingPersonIsValid,
        hasError: reportingPersonInputHasError,
        valueChangeHandler: reportingPersonChangeHandler,
        inputBlurhandler: reportingPersonBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredDesignation,
        isValid: enteredDesignationIsValid,
        hasError: designationInputHasError,
        valueChangeHandler: designationChangeHandler,
        inputBlurhandler: designationBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredEventType,
        isValid: enteredEventTypeIsValid,
        hasError: eventTypeInputHasError,
        valueChangeHandler: eventTypeChangeHandler,
        inputBlurhandler: eventTypeBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredPaymentType,
        isValid: enteredPaymentTypeIsValid,
        hasError: paymentTypeInputHasError,
        valueChangeHandler: paymentTypeChangeHandler,
        inputBlurhandler: paymentTypeBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredAmount,
        isValid: enteredAmountIsValid,
        hasError: amountInputHasError,
        valueChangeHandler: amountChangeHandler,
        inputBlurhandler: amountBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredJobDescription,
        isValid: enteredJobDescriptionIsValid,
        hasError: jobDescriptionInputHasError,
        valueChangeHandler: jobDescriptionChangeHandler,
        inputBlurhandler: jobDescriptionBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredMsgForCasual,
        isValid: enteredMsgForCasualIsValid,
        hasError: msgForCasualInputHasError,
        valueChangeHandler: msgForCasualChangeHandler,
        inputBlurhandler: msgForCasualBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredStartDate,
        isValid: enteredStartDateIsValid,
        hasError: startDateInputHasError,
        valueChangeHandler: startDateChangeHandler,
        inputBlurhandler: startDateBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredEndDate,
        isValid: enteredEndDateIsValid,
        hasError: endDateInputHasError,
        valueChangeHandler: endDateChangeHandler,
        inputBlurhandler: endDateBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredShiftTimeStart,
        isValid: enteredShiftTimeStartIsValid,
        hasError: shiftTimeStartInputHasError,
        valueChangeHandler: shiftTimeStartChangeHandler,
        inputBlurhandler: shiftTimeStartBlurHandler
    } = useInput(isNotEmpty);
    const {
        value: enteredShiftTimeEnd,
        isValid: enteredShiftTimeEndIsValid,
        hasError: shiftTimeEndInputHasError,
        valueChangeHandler: shiftTimeEndChangeHandler,
        inputBlurhandler: shiftTimeEndBlurHandler
    } = useInput(isNotEmpty);
    
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const adminData = adminAuthState.user.private_user ? adminAuthState.user.private_user: adminAuthState.user.manager;

    useEffect(() => {
        dispatch(getAllCities());
        dispatch(getJobTypes());
        dispatch(removeCasualJobError());
        if(adminData){
          if(adminAuthState.user?.private_user){
            dispatch(getAllClientsFromServer());
          }
          if(adminAuthState.user?.manager){
            console.log(adminAuthState.user.manager);
            setEnteredClientId(adminData.clientId);
            dispatch(getClientBasedOnManager());
          }
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      if (
        enteredJobTitleIsValid &&
        enteredNoOfCasualsIsValid &&
        enteredOutletNameIsValid &&
        enteredReportingPersonIsValid &&
        enteredDesignationIsValid &&
        enteredAmountIsValid &&
        enteredStartDateIsValid &&
        enteredEndDateIsValid &&
        enteredShiftTimeStartIsValid &&
        enteredShiftTimeEndIsValid &&
        enteredCityIdIsValid &&
        enteredPropertyIdIsValid &&
        enteredJobTypeIdIsValid &&
        enteredEventTypeIsValid &&
        enteredPaymentTypeIsValid &&
        enteredJobDescriptionIsValid &&
        enteredMsgForCasualIsValid
      ) {
        formIsValid = true;
      }
    
      const errors = {
        job_title : "",
        no_of_casuals : "",
        outlet_name : "",
        reporting_person : "",
        designation : "",
        event_type : "",
        start_date: "",
        end_date: "",
        shift_time_start: "",
        shift_time_end: "",
        payment_type: "",
        amount: "",
        job_description: "",
        message_for_casual: "",
        things_to_bring: "",
        cityId : "",
        propertyId : "",
        clientId : "",
        jobTypeId : ""
      }
    
      if(casualJobState.error){
        for(let key in errors) {
          if(Array.isArray(casualJobState.error)){
            for(let errData of casualJobState.error){
              if(key === errData.param && errors[key] === ""){
                errors[key] = errData.msg;
              }
            }
          }
        }
      }
    

    const handleCasualJobCreate = (e) => {
        e.preventDefault();

        if (
          !enteredJobTitleIsValid &&
          !enteredNoOfCasualsIsValid &&
          !enteredOutletNameIsValid &&
          !enteredReportingPersonIsValid &&
          !enteredDesignationIsValid &&
          !enteredAmountIsValid &&
          !enteredStartDateIsValid &&
          !enteredEndDateIsValid &&
          !enteredShiftTimeStartIsValid &&
          !enteredShiftTimeEndIsValid &&
          !enteredCityIdIsValid &&
          !enteredPropertyIdIsValid &&
          !enteredJobTypeIdIsValid &&
          !enteredEventTypeIsValid &&
          !enteredPaymentTypeIsValid &&
          !enteredJobDescriptionIsValid &&
          !enteredMsgForCasualIsValid
        ) {
          return;
        }
        const casualJobObj = new FormData();
        casualJobObj.append("job_title", enteredJobTitle);
        casualJobObj.append("no_of_casuals", enteredNoOfCasuals);
        casualJobObj.append("outlet_name", enteredOutletName);
        casualJobObj.append("reporting_person", enteredReportingPerson);
        casualJobObj.append("designation", enteredDesignation);
        casualJobObj.append("event_type", enteredEventType);
        casualJobObj.append("start_date", enteredStartDate);
        casualJobObj.append("end_date", enteredEndDate);
        casualJobObj.append("shift_time_start", enteredShiftTimeStart);
        casualJobObj.append("shift_time_end", enteredShiftTimeEnd);
        casualJobObj.append("payment_type", enteredPaymentType);
        casualJobObj.append("amount", enteredAmount);
        casualJobObj.append("job_description", enteredJobDescription);
        casualJobObj.append("message_for_casual", enteredMsgForCasual);
        casualJobObj.append("things_to_bring", tags);
        casualJobObj.append("cityId", enteredCityId);
        casualJobObj.append("propertyId", enteredPropertyId);
        casualJobObj.append("clientId", enteredClientId);
        casualJobObj.append("jobTypeId", enteredJobTypeId);

        storeCasualJob(casualJobObj);

    }

    const storeCasualJob = async (casualJobData) => {
      try {
        const result = await casualJobService.storeCasualJobToServer(casualJobData);
        if(result.status){
          toast.success(result.message);
          dispatch(removeProperties());
          navigate("..");
        }
      } catch (err) {
        const result = apiErrorHandler(err);
        dispatch(addCasualJobError(result.error));
        toast.warning(result.message);
      }
    }

    const handleClientIdChange = (clientId) => {
      // let clientId = e.target.value;
      setEnteredClientId(clientId);
      if(clientId){
        dispatch(getAllPropertiesByClientId(clientId));
      }else{
        dispatch(removeProperties());
      }
    }

    const clientIdInputBlurhandler = (e) => {
      setClientIdIsTouched(true);
    }

    const removeTag = (index) => {
      const updatedTags = [...tags];
      updatedTags.splice(index,1);
      setTags(updatedTags);
    }
    // const removeAllTags = () => {
    //   setTags([]);
    // }
  
    const addTag = () => {
      const newTags = newTag
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag && !tags.includes(tag));
  
      if(newTag.length > 0) {
        setTags([...tags, ...newTags]);
      }
      setNewTag("");
    }

  return (
    <>
      <Meta title="Add CasualJob" />
      <h3>Add CasualJob</h3>

      <div className="form-wrapper p-3">
        <form onSubmit={handleCasualJobCreate} encType="application/form-data">
          <div className="row">
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="job_title">Job Title</label>
                <input
                  type="text"
                  name="job_title"
                  id="job_title"
                  className="form-control"
                  value={enteredJobTitle}
                  onChange={jobTitleChangeHandler}
                  onBlur={jobTitleBlurHandler}
                />
                {jobTitleInputHasError && (
                  <p className="text-danger">Job Title must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.job_title}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="no_of_casuals">NoOf Casuals</label>
                <input
                  type="number"
                  name="no_of_casuals"
                  id="no_of_casuals"
                  className="form-control"
                  value={enteredNoOfCasuals}
                  onChange={noOfCasualsChangeHandler}
                  onBlur={noOfCasualsBlurHandler}
                />
                {noOfCasualsInputHasError && (
                  <p className="text-danger">NoOf Casual must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.no_of_casuals}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="outlet_name">Outlet Name</label>
                <input
                  type="text"
                  name="outlet_name"
                  id="outlet_name"
                  className="form-control"
                  value={enteredOutletName}
                  onChange={outletNameChangeHandler}
                  onBlur={outletNameBlurHandler}
                />
                {outletNameInputHasError && (
                  <p className="text-danger">Outlet Name must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.outlet_name}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="reporting_person">Reporting Person</label>
                <input
                  type="text"
                  name="reporting_person"
                  id="reporting_person"
                  className="form-control"
                  value={enteredReportingPerson}
                  onChange={reportingPersonChangeHandler}
                  onBlur={reportingPersonBlurHandler}
                />
                {reportingPersonInputHasError && (
                  <p className="text-danger">
                    Reporting Person must not be empty!!
                  </p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.reporting_person}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="designation">Designation</label>
                <input
                  type="text"
                  name="designation"
                  id="designation"
                  className="form-control"
                  value={enteredDesignation}
                  onChange={designationChangeHandler}
                  onBlur={designationBlurHandler}
                />
                {designationInputHasError && (
                  <p className="text-danger">Designation must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.designation}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="form-control"
                  value={enteredAmount}
                  onChange={amountChangeHandler}
                  onBlur={amountBlurHandler}
                />
                {amountInputHasError && (
                  <p className="text-danger">Amount must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.amount}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="start_date">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  className="form-control"
                  value={enteredStartDate}
                  onChange={startDateChangeHandler}
                  onBlur={startDateBlurHandler}
                />
                {startDateInputHasError && (
                  <p className="text-danger">StartDate must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.start_date}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  className="form-control"
                  value={enteredEndDate}
                  onChange={endDateChangeHandler}
                  onBlur={endDateBlurHandler}
                />
                {endDateInputHasError && (
                  <p className="text-danger">EndDate must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.end_date}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="shift_time_start">Shift Time Start</label>
                <input
                  type="time"
                  name="shift_time_start"
                  id="shift_time_start"
                  className="form-control"
                  value={enteredShiftTimeStart}
                  onChange={shiftTimeStartChangeHandler}
                  onBlur={shiftTimeStartBlurHandler}
                />
                {shiftTimeStartInputHasError && (
                  <p className="text-danger">
                    ShiftTime Start must not be empty!!
                  </p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.shift_time_start}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="shift_time_end">Shift Time End</label>
                <input
                  type="time"
                  name="shift_time_end"
                  id="shift_time_end"
                  className="form-control"
                  value={enteredShiftTimeEnd}
                  onChange={shiftTimeEndChangeHandler}
                  onBlur={shiftTimeEndBlurHandler}
                />
                {shiftTimeEndInputHasError && (
                  <p className="text-danger">
                    ShiftTime End must not be empty!!
                  </p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.shift_time_end}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
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
                {casualJobState.error && (
                  <p className="text-danger">{errors.cityId}</p>
                )}
              </div>
            </div>
            { adminAuthState.user.private_user && (
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="clientId">Client</label>
                <select
                  name="clientId"
                  id="clientId"
                  className="form-select"
                  onChange={(e) => handleClientIdChange(e.target.value)}
                  onBlur={clientIdInputBlurhandler}
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
                {clientIdHasError && (
                  <p className="text-danger">Client must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.clientId}</p>
                )}
              </div>
            </div>
            )}
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="propertyId">Property</label>
                <select
                  name="propertyId"
                  id="propertyId"
                  className="form-select"
                  value={enteredPropertyId}
                  onChange={propertyIdChangeHandler}
                  onBlur={propertyIdBlurHandler}
                >
                  <option value="">-- Property --</option>
                  {propertyState.properties &&
                    propertyState.properties.map((property) => {
                      return (
                        <option key={property.id} value={property.id}>
                          {property.property_name}
                        </option>
                      );
                    })}
                </select>
                {propertyIdInputHasError && (
                  <p className="text-danger">Property must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.propertyId}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="jobTypeId">JobType</label>
                <select
                  name="jobTypeId"
                  id="jobTypeId"
                  className="form-select"
                  value={enteredJobTypeId}
                  onChange={jobTypeIdChangeHandler}
                  onBlur={jobTypeIdBlurHandler}
                >
                  <option value="">-- JobType --</option>
                  {jobTypeState.jobTypes &&
                    jobTypeState.jobTypes.map((jobType) => {
                      return (
                        <option key={jobType.id} value={jobType.id}>
                          {jobType.jobType}
                        </option>
                      );
                    })}
                </select>
                {jobTypeIdInputHasError && (
                  <p className="text-danger">JobType must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.jobTypeId}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="event_type">EventType</label>
                <select
                  name="event_type"
                  id="event_type"
                  className="form-select"
                  value={enteredEventType}
                  onChange={eventTypeChangeHandler}
                  onBlur={eventTypeBlurHandler}
                >
                  <option value="">-- EventType --</option>
                  <option value="multiple_day">Multiple Day</option>
                  <option value="single_day">Single Day</option>
                </select>
                {eventTypeInputHasError && (
                  <p className="text-danger">EventType must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.event_type}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="payment_type">PaymentType</label>
                <select
                  name="payment_type"
                  id="payment_type"
                  className="form-select"
                  value={enteredPaymentType}
                  onChange={paymentTypeChangeHandler}
                  onBlur={paymentTypeBlurHandler}
                >
                  <option value="">-- PaymentType --</option>
                  <option value="per_day">Per Day</option>
                  <option value="per_hour">Per Hour</option>
                </select>
                {paymentTypeInputHasError && (
                  <p className="text-danger">PaymentType must not be empty!!</p>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.payment_type}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="job_description">Job Description</label>
                <textarea
                  name="job_description"
                  id="job_description"
                  cols="30"
                  rows="2"
                  className="form-control"
                  onChange={jobDescriptionChangeHandler}
                  onBlur={jobDescriptionBlurHandler}
                  defaultValue={enteredJobDescription}
                ></textarea>
                {jobDescriptionInputHasError && !enteredJobDescription && (
                  <span className="text-danger">JobDescription must not be empty!!</span>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.job_description}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group mt-3">
                <label htmlFor="message_for_casual">Message for Casual</label>
                <textarea
                  name="message_for_casual"
                  id="message_for_casual"
                  cols="30"
                  rows="2"
                  className="form-control"
                  onChange={msgForCasualChangeHandler}
                  onBlur={msgForCasualBlurHandler}
                  defaultValue={enteredMsgForCasual}
                ></textarea>
                {msgForCasualInputHasError && !enteredMsgForCasual && (
                  <span className="text-danger">Message must not be empty!!</span>
                )}
                {casualJobState.error && (
                  <p className="text-danger">{errors.message_for_casual}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="content mt-3">
                <label htmlFor="things_to_bring">Things to Bring</label>
                <div className="d-flex mt-3">
                  <input
                    type="text"
                    spellCheck="false"
                    name="things_to_bring"
                    id="things_to_bring"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    // onKeyUp={(e) => {
                    //   e.preventDefault();
                    //   console.log(e.key);
                    //   if (e.key === "Enter") {
                    //     addTag();
                    //   }
                    // }}
                  />
                  <span className="btn btn-primary btn-sm" onClick={addTag}>
                    Add
                  </span>
                </div>
                { casualJobState.error && (<span className='text-danger'>{errors.things_to_bring}</span>)}
              </div>
            </div>
            { tags.length > 0 && (
            <div className="col-12 col-md-3">
              <div className="content">
                <ul>
                  {tags.map((tag, index) => (
                    <li key={index}>
                      {tag}
                      <BsTrash className='text-danger' onClick={() => removeTag(index)} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>)}
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

export default AddCasualJob