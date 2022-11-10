import React, { useState } from 'react'
import PropTypes from 'prop-types'
import bridge from '@vkontakte/vk-bridge'

const UserContext = React.createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authData, setAuthData] = useState(null)

  const saveAuthData = data =>
    bridge
      .send('VKWebAppStorageSet', {
        key: 'accessToken',
        value: JSON.stringify(data),
      })
      .then(({ result }) => {
        if (result) setAuthData(data);
      });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        authData,
        saveAuthData,
        setAuthData,
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