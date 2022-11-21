import React from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { Stories, Views, Panels } from  "../../services/const.js";

const SuggestPanel = ({ methods }) => {

  const closePanel = () => {
    methods.go(Stories.Main, Views.Main.Overview, Panels.Main.Overview.Main)
  }

  return (
    <Panel>
      <PanelHeader separator={false}
        before={
          <PanelHeaderBack onClick={closePanel} />
        }
      >Что посмотреть</PanelHeader>
      <Placeholder>
        Тут я подскажу тебе что посмотреть
      </Placeholder>
    </Panel>
  )
}

export default SuggestPanel;
  