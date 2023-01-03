import React from 'react'
import { Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui'

const DonatePanel = ({ methods }) => {
  return (
    <Panel>
      <PanelHeader separator={false}
        before={
          <PanelHeaderBack onClick={methods.viewPanelBack} />
        }
      >Поддержать</PanelHeader>
      <Placeholder stretched>
        На еду литерали
      </Placeholder>
    </Panel>
  )
}

export default DonatePanel;
  