import React, { useContext } from 'react'
import { Button, FormItem, FormLayout, Group, Panel, PanelHeader, PanelHeaderBack, Placeholder, Textarea } from '@vkontakte/vkui'

import UserContext from "@contexts/user"
import PreferencesContext from "@contexts/preferences"

const TestsPanel = ({ methods }) => {
  const user = useContext(UserContext)
  const preferences = useContext(PreferencesContext)

  const session = () => {
    user.getSession()
  }

  const logout = () => {
    user.logout()
  }

  return (
    <Panel>
      <PanelHeader separator={false}
        before={
          <PanelHeaderBack onClick={methods.viewPanelBack} />
        }
      >Проверочная</PanelHeader>
      <Placeholder>
        Тут я тестирую разное, не обращайте внимания
      </Placeholder>
      <Group>
        <FormLayout>
          <FormItem top="Параметры запуска">
            <Textarea rows={7} name="launchParams" value={user.launchParams} />
          </FormItem>
        </FormLayout>
      </Group>
  
      <Group>
        <FormLayout>
          <FormItem top="Данные контекста пользователя">
            <pre>{JSON.stringify(user, null, 2) }</pre>
          </FormItem>
          <FormItem top="Данные контекста предпочтений">
            <pre>{JSON.stringify(preferences, null, 2) }</pre>
          </FormItem>
          </FormLayout>
      </Group>
  
      <Group>
        <FormLayout>
          <FormItem>
            <Button size="l" stretched onClick={session}>Запросить сессию</Button>
          </FormItem>
          <FormItem>
            <Button size="l" stretched appearance="negative" mode="outline" onClick={logout}>Закончить сессию</Button>
          </FormItem>
        </FormLayout>
      </Group>
    </Panel>
  )
}

export default TestsPanel;
  