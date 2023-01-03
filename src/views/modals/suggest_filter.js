import React from 'react'
import {
  Platform, withModalRootContext, 
  ModalPage, ModalPageHeader, PanelHeaderButton, usePlatform, Group, CellButton
} from '@vkontakte/vkui'
import { Icon24Cancel, Icon24Dismiss } from '@vkontakte/icons'

const ModalPageSuggestFilter = ({ id, methods }) => {
  const platform = usePlatform()

  const showResult = () => {
    methods.modalBack()
  }

  const clearFilter = () => {

  }

  return (
    <ModalPage id={id}
      header={
        <ModalPageHeader
          before={(
            <React.Fragment>
              {(platform === Platform.ANDROID || platform === Platform.VKCOM) && <PanelHeaderButton aria-label="Назад" onClick={methods.modalBack}><Icon24Cancel /></PanelHeaderButton>}
              {platform === Platform.IOS && <PanelHeaderButton onClick={clearFilter}>Отчистить</PanelHeaderButton>}
            </React.Fragment>
          )}
          after={(
            <React.Fragment>
              {(platform === Platform.ANDROID || platform === Platform.VKCOM) && <PanelHeaderButton onClick={clearFilter}>Отчистить</PanelHeaderButton>}
              {platform === Platform.IOS && <PanelHeaderButton aria-label="Назад" onClick={methods.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
            </React.Fragment>
          )}
        />
      }
    >
      <Group>
        <CellButton onClick={showResult}>
          Применить
        </CellButton>
      </Group>
    </ModalPage>
  );
}

export default withModalRootContext(ModalPageSuggestFilter);
  