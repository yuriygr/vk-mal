import React, { useContext } from 'react'
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui'

import UserContext from '@contexts/user'
import PreferencesContext from '@contexts/preferences'

import App from './App'
import SplashScreen from './SplashScreen'

const Root = () => {
  const user = useContext(UserContext)
  const preferences = useContext(PreferencesContext)

  return (
    <ConfigProvider appearance={preferences.appearance}>
      <AdaptivityProvider>
        {
          (user.fetching || user.error)
          ? <SplashScreen />
          : <App />
        }
      </AdaptivityProvider>
    </ConfigProvider>
  )
}

export default Root