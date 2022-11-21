import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

const UserContext = React.createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authData, setAuthData] = useState(null)

  const fetchUser = () => {
    const params = window.location.search.slice(1)
    console.log(params)
  }

  useEffect(() => {

  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        authData,
        setAuthData,
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