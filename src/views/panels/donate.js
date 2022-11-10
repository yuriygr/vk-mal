import React from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { Stories, Views, Panels } from  "../../services/const.js";


const DonatePanel = ({ methods }) => {

  const closePanel = () => {
    methods.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Main)
  }

  return (
    <Panel>
      <PanelHeader separator={false}
        before={
          <PanelHeaderBack onClick={closePanel} />
        }
      >Поддержать</PanelHeader>
      <Placeholder>
        На еду литерали
      </Placeholder>
    </Panel>
  )
}

export default DonatePanel;
  