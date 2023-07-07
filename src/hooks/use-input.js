import { useState } from 'react'

const useInput = (validateValue) => {

    const [enteredValue, setEnteredValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const valueIsValid = validateValue(enteredValue);
    const hasError = !valueIsValid && isTouched;

    const valueChangeHandler = (event) => {
        setEnteredValue(event.target.value);
    }

    const inputBlurhandler = (event) => {
        setIsTouched(true);
    }

    const reset = () => {
        setEnteredValue('');
        setIsTouched(false);
    }

    const oldValue = (oldVal) => {
      setEnteredValue(oldVal);
    }

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurhandler,
    reset,
    oldValue,
  }
}

export default useInput