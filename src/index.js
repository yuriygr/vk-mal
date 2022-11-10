import React from 'react'
import ReactDOM from 'react-dom'
import App from './views/App'
import * as serviceWorker from './serviceWorker'
import bridge from '@vkontakte/vk-bridge'
import { UserProvider } from './contexts/user'
import { PreferencesProvider } from './contexts/preferences'

bridge.send("VKWebAppInit")
bridge.subscribe((e) => {
  switch (e.detail.type) {
    case 'VKWebAppUpdateConfig':
    const schemeAttribute = document.createAttribute('scheme')
    schemeAttribute.value = e.detail.data.scheme ? e.detail.data.scheme : 'client_light'
    document.body.attributes.setNamedItem(schemeAttribute)
    break;

    default:
    break;
  }
})
ReactDOM.render(
  <UserProvider>
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  </UserProvider>
, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
