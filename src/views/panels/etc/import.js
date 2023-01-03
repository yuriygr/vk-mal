import React from 'react'
import { Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui'

const ImportPanel = ({ methods }) => {
  return (
    <Panel>
      <PanelHeader separator={false}
        before={
          <PanelHeaderBack onClick={methods.viewPanelBack} />
        }
      >Импорт</PanelHeader>
      <Placeholder stretched>
        Очевидно, что не сейчас
      </Placeholder>
    </Panel>
  )
}

export default ImportPanel;
  