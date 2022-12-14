import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import Api from '../services/api'

const UserContext = React.createContext(null)

export const UserProvider = ({ children, splashScreen }) => {
  const [launchParams, setLaunchParams] = useState("")
  const [userData, setUserData] = useState({})
  const [sessionData, setSessionData] = useState({})

  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(false)

  const fetchUser = () => {
    const urlParams = window.location.search.slice(1) || process.env.REACT_APP_DEFAULT_LAUNCH_PARAMS
    if (urlParams !== "") {
      setLaunchParams(urlParams)
    }
    const params = Object.fromEntries(new URLSearchParams(urlParams))

    Api.auth.pizdec(params)
    .then(result => {
      setSessionData(result.payload)
      setFetching(false)
    })
    .catch(error => {
      setError(error)
      setFetching(false)
    })
  }

  const getSession = () => {
    Api.auth.session()
    .then(result => {
      setSessionData(result)
      setFetching(false)
    })
    .catch(error => {
      setError(error)
      setFetching(false)
    })
  }

  const logout = () => {
    let session_id = sessionData.session_id

    Api.auth.logout({ session_id })
    .then(result => {
      setSessionData(result.payload)
      setFetching(false)
    })
    .catch(error => {
      setError(error)
      setFetching(false)
    })
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider
      value={{
        launchParams,
        userData,
        sessionData,
        fetching,
        error,

        logout,
        getSession,
        fetchUser
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ])
}

export default UserContext