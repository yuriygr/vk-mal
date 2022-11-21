import React, { useContext } from 'react'
import { Button, FormItem, FormLayout, Group, Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui'

import { Stories, Views, Panels } from  '../../services/const'
import UserContext from '../../contexts/user'
import PreferencesContext from '../../contexts/preferences'

const TestsPanel = ({ methods }) => {
  const user = useContext(UserContext)
  const preferences = useContext(PreferencesContext)

  const closePanel = () => {
    methods.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Main)
  }

  const testClick = () => {
    user.setUser({ test: 'test' })
    preferences.setLanguage('english')
    preferences.setDebug(true)
    preferences.setAppearance(preferences.appearance == 'light' ? 'dark' : 'light')
  }

  return (
    <Panel>
      <PanelHeader separator={false}
        before={
          <PanelHeaderBack onClick={closePanel} />
        }
      >Проверочная</PanelHeader>
      <Placeholder>
        Тут я тестирую разное, не обращайте внимания
      </Placeholder>
      <Group>
        <FormLayout>
          <FormItem top="Данные контекста пользователя">
            <pre>{JSON.stringify(user, null, 2) }</pre>
          </FormItem>
          <FormItem top="Данные контекста предпочтений">
            <pre>{JSON.stringify(preferences, null, 2) }</pre>
          </FormItem>
          <FormItem>
            <Button size="l" stretched onClick={testClick}>Отправить тестовые данные</Button>
          </FormItem>
        </FormLayout>
      </Group>
    </Panel>
  )
}

export default TestsPanel;
  