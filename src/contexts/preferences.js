import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import bridge from '@vkontakte/vk-bridge';

const PreferencesContext = React.createContext(null)

export const PreferencesProvider = ({ children }) => {
  const [appearance, setAppearance] = useState(false)
  const [language, setLanguage] = useState('russian')
  const [secret, setSecret] = useState(false)
  const [debug, setDebug] = useState(false)

  const watchBridge = () => {
    bridge.subscribe((e) => {
      switch (e.detail.type) {
        case 'VKWebAppUpdateConfig':
          setAppearance(e.detail.data.appearance)
          break;
      
        default:
          break;
      }
    })
  }

  useEffect(() => {
    watchBridge()
  }, [])

  return (
    <PreferencesContext.Provider
      value={{
        appearance,
        setAppearance,
        language,
        setLanguage,
        debug,
        setDebug,
        secret,
        setSecret
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