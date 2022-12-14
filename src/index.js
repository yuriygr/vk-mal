import React from 'react'
import ReactDOM from 'react-dom'
import Root from './views/Root'
import * as serviceWorker from './serviceWorker'
import bridge from '@vkontakte/vk-bridge'

import { UserProvider } from './contexts/user'
import { PreferencesProvider } from './contexts/preferences'
import { NavigationProvider } from './contexts/navigator'

import '@vkontakte/vkui/dist/vkui.css'

// "Стартуем", - Игорь Негода
bridge.send("VKWebAppInit")

ReactDOM.render(
  <PreferencesProvider>
    <NavigationProvider>
      <UserProvider>
        <Root />
      </UserProvider>
    </NavigationProvider>
  </PreferencesProvider>
, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
