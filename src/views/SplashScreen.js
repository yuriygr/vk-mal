import React, { useContext } from 'react'

import { AppRoot, Placeholder, ScreenSpinner, SplitLayout } from '@vkontakte/vkui'
import { Icon56BlockOutline } from '@vkontakte/icons'

import UserContext from '@contexts/user'

const SplashScreen = ({ fetching, error }) => {
  const user = useContext(UserContext)

  return (
    <AppRoot>
      <SplitLayout popout={user.fetching && <ScreenSpinner />}>
        { (!user.fetching && user.error) &&
          <Placeholder stretched header="Ошибка" icon={<Icon56BlockOutline />}>
            { user.error }
          </Placeholder>
        }
      </SplitLayout>
    </AppRoot>
  )
}

export default SplashScreen
  