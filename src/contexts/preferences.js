import React, { useState } from 'react'
import PropTypes from 'prop-types'
import bridge from '@vkontakte/vk-bridge'

const PreferencesContext = React.createContext(null)

export const PreferencesProvider = ({ children }) => {
  const [language, setLanguage] = useState('russian')
  const [debug, setDebug] = useState(false)

   return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        debug,
        setDebug
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

PreferencesProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ])
}

export default PreferencesContext