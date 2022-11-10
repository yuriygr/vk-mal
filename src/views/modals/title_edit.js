import React from 'react';
import {
  Platform, withModalRootContext, Slider, FormItem,
  ModalPage, Group, Header, ModalPageHeader, PanelHeaderButton, PanelHeaderSubmit, CellButton, usePlatform, HorizontalScroll, Tabs, TabsItem
} from '@vkontakte/vkui';
import { Icon20TrashSmileOutline, Icon24Cancel, Icon24Dismiss } from '@vkontakte/icons';
import { LIST_TABS, TABS_ANIME, TITLE_EDIT_MODAL } from '../../services/const';

const ModalPageTitleEdit = ({ type = 'add', data, goBack }) => {
  const platform = usePlatform()

  const handleChange = () => {

  }

  const changeSlider = () => {

  }

  const saveEdit = () => {

  }

  const removeTitle = () => {

  }

  const types = LIST_TABS;

  return (
    <ModalPage id={TITLE_EDIT_MODAL}
      header={
        <ModalPageHeader
          before={(
            <React.Fragment>
              {(platform === Platform.ANDROID || platform === Platform.VKCOM) && <PanelHeaderButton aria-label="Назад" onClick={goBack}><Icon24Cancel /></PanelHeaderButton>}
              {platform === Platform.IOS && <PanelHeaderSubmit onClick={saveEdit}>Сохранить</PanelHeaderSubmit>}
            </React.Fragment>
          )}
          after={(
            <React.Fragment>
              {(platform === Platform.ANDROID || platform === Platform.VKCOM) && <PanelHeaderSubmit onClick={saveEdit}>Сохранить</PanelHeaderSubmit>}
              {platform === Platform.IOS && <PanelHeaderButton aria-label="Назад" onClick={goBack}><Icon24Dismiss /></PanelHeaderButton>}
            </React.Fragment>
          )}
        />
      }
    >
      <Group header={<Header>Статус</Header>}>
        <Tabs mode="accent">
          <HorizontalScroll>
            { types[TABS_ANIME].filter(i => i.key !== 'all').map(tab =>
              <TabsItem aria-controls={tab.label} selected={tab.key === data.list} key={tab.key}>{tab.label}</TabsItem>
            ) }
          </HorizontalScroll>
        </Tabs>
      </Group>
      <Group header={<Header>Прогресс</Header>}>
        <FormItem>
          <Slider
            step={1}
            min={0}
            max={Number(data.series.total)}
            value={Number(data.series.viewed)}
            onChange={changeSlider}
          />
        </FormItem>
      </Group>
      <Group header={<Header>Рейтинг</Header>}>
        <FormItem>
          <Slider
            step={1}
            min={0}
            max={10}
            value={Number(data.rating.my)}
            onChange={changeSlider}
          />
        </FormItem>
      </Group>
      <Group header={<Header>Даты</Header>}>
        <FormItem top="Начало просмотра">

        </FormItem>
        <FormItem top="Конец просмотра">

        </FormItem>
      </Group>
      { data.list !== '' &&
        <Group>
          <CellButton mode="danger" before={ <Icon20TrashSmileOutline /> } onClick={removeTitle}>
            Удалить из списка
          </CellButton>
        </Group>
      }
    </ModalPage>
  );
}

export default withModalRootContext(ModalPageTitleEdit);
  