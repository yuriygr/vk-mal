import React, { useContext } from 'react';
import { Cell, Footer, Group, Header, List, Panel, PanelHeader, SimpleCell, Switch } from '@vkontakte/vkui'
import { Icon24ExternalLinkOutline, Icon28ArrowDownToSquareOutline, Icon28BracketsSlashSquareOutline, Icon28BugOutline, Icon28HieroglyphCharacterOutline, Icon28HorseToyOutline, Icon28MoneyCircleOutline, Icon28QuestionOutline, Icon28ShareExternalOutline } from '@vkontakte/icons';

import { Stories, Views, Panels } from  '@services/const'
import PreferencesContext from '@contexts/preferences'

const EtcPanel = ({ methods }) => {
  const preferences = useContext(PreferencesContext)

  const changeDebug = (e) => {
    preferences.setDebug(e.target.checked)
  }

  const version = 
    `Версия 1.8.6`

  return (
    <Panel>
      <PanelHeader separator={false}>Еще</PanelHeader>
      <Group>
        <Header>Настройки</Header>
        <List>
          <SimpleCell expandable before={<Icon28HieroglyphCharacterOutline />} indicator="Русский">Названия</SimpleCell>
          <SimpleCell Component="label" before={<Icon28BugOutline />} after={<Switch defaultChecked={preferences.debug} onChange={changeDebug} />}>Режим отладки</SimpleCell>
        </List>
      </Group>
      <Group>
        <List>
          <Cell expandable before={<Icon28QuestionOutline />} onClick={() => methods.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Feedback)}>
            Обратная связь
          </Cell>
          <Cell expandable before={<Icon28MoneyCircleOutline />} onClick={() => methods.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Donate)}>
            Поддержать
          </Cell>
          <Cell expandable before={<Icon28ArrowDownToSquareOutline />} onClick={() => methods.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Import)}>
            Импорт
          </Cell>
          { preferences.debug &&
            <Cell expandable before={<Icon28HorseToyOutline />} onClick={() => methods.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Tests)}>
              Проверочная
            </Cell>
          }
          <SimpleCell before={<Icon28BracketsSlashSquareOutline />} after={<Icon24ExternalLinkOutline color='var(--vkui--color_icon_tertiary)' />} component="a" target="_blank" href="https://github.com/yuriygr/vk-mal">Исходный код</SimpleCell>
        </List>
      </Group>
      <Footer>{ version }</Footer>
    </Panel>
  )
}

export default EtcPanel;
  