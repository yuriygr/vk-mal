import React from 'react'
import {
  Platform, withModalRootContext, 
  ModalPage, ModalPageHeader, PanelHeaderButton, PanelHeaderSubmit, usePlatform, Group, CellButton
} from '@vkontakte/vkui'
import { Icon24Cancel, Icon24Dismiss } from '@vkontakte/icons'

import { Modals } from '@services/const'

const ModalPageSuggestFilter = ({ methods }) => {
  const platform = usePlatform()

  const showResult = () => {
    methods.modalBack()
  }

  const clearFilter = () => {

  }

  return (
    <ModalPage id={Modals.SuggestFilter}
      header={
        <ModalPageHeader
          before={(
            <React.Fragment>
              {(platform === Platform.ANDROID || platform === Platform.VKCOM) && <PanelHeaderButton aria-label="Назад" onClick={methods.modalBack}><Icon24Cancel /></PanelHeaderButton>}
              {platform === Platform.IOS && <PanelHeaderSubmit onClick={clearFilter}>Отчистить</PanelHeaderSubmit>}
            </React.Fragment>
          )}
          after={(
            <React.Fragment>
              {(platform === Platform.ANDROID || platform === Platform.VKCOM) && <PanelHeaderSubmit onClick={clearFilter}>Отчистить</PanelHeaderSubmit>}
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
  