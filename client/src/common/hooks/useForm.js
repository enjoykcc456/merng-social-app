import { useState } from 'react'

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState)

  const handleOnChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleOnSubmit = e => {
    e.preventDefault()
    callback()
  }

  return { values, handleOnChange, handleOnSubmit }
}
