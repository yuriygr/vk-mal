import React, { useContext, useState } from 'react'
import {
  Platform, withModalRootContext, Slider, FormItem,
  ModalPage, Group, Header, ModalPageHeader, PanelHeaderButton, PanelHeaderSubmit, CellButton, usePlatform, SubnavigationButton, DateInput, Counter, Alert, Snackbar, Avatar, Button
} from '@vkontakte/vkui'
import { Icon16Done, Icon20TrashSmileOutline, Icon24Cancel, Icon24Dismiss } from '@vkontakte/icons'

import { SubnavigationGrid } from '@components/ui'
import PreferencesContext from "@contexts/preferences"
import { LIST_TABS, TABS_ANIME, Modals } from '@services/const'
import Api from '@services/api'

const ModalPageTitleEdit = ({ data, updateData, methods }) => {
  const platform = usePlatform()
  const preferences = useContext(PreferencesContext)

  const [ fields, setFileds ] = useState({
    list: data.list,
    progress: data.series.viewed,
    rating: data.rating.my,
    date_start: null,
    date_end: null
  })

  const changeField = (key, value) => {
    setFileds(prev => ({ ...prev, [key]: value }))
  }

  const alert_success = text => {
    let icon = (
      <Avatar size={24} style={{ background: "var(--vkui--color_background_accent)" }}>
        <Icon16Done fill="#fff" width={14} height={14} />
      </Avatar>
    )
    return <Snackbar before={icon} onClose={() => methods.openPopout(null)}>{text}</Snackbar>
  }

  const alert_error = text => {
    let actions = [
      { title: 'Закрыть', autoClose: true, mode: 'cancel' }
    ]
    return <Alert
      actionsLayout="horizontal"
      header="Ошибка"
      text={text}
      actions={actions}
      onClose={() => methods.openPopout(null)} />
  }

  const saveEdit = () => {
    Api.my.list.update('anime', data.anime_id, fields)
    .then(_ => {
      updateData({
        list: fields.list,
        rating: {...data.rating, my: fields.rating },
        series: {...data.series, viewed: fields.progress}
      })
      methods.openPopout(alert_success("Изменения успешно сохранены"))
      methods.modalBack()
    })
    .catch(error => {
      methods.openPopout(alert_error("Невозможно отправить запрос, попробуйте позднее"))
    })
  }

  const removeTitle = () => {
    Api.my.list.delete('anime', data.anime_id)
    .then(_ => {
      updateData({
        list: false,
        rating: {...data.rating, my: 0 },
        series: {...data.series, viewed: 0}
      })
      methods.openPopout(alert_success("Изменения успешно сохранены"))
      methods.modalBack()
    })
    .catch(error => {
      methods.openPopout(alert_error("Невозможно отправить запрос, попробуйте позднее"))
    })
  }

  const types = LIST_TABS;

  const progressIndicator = (
    <Counter size="m" mode="contrast">{Number(fields.progress)} из {data.series.total}</Counter>
  )

  const ratingIndicator = (
    <Counter size="m" mode="contrast">{Number(fields.rating)}</Counter>
  )

  return (
    <ModalPage id={Modals.TitleEdit}
      header={
        <ModalPageHeader
          before={(
            <React.Fragment>
              {(platform === Platform.ANDROID || platform === Platform.VKCOM) && <PanelHeaderButton aria-label="Назад" onClick={methods.modalBack}><Icon24Cancel /></PanelHeaderButton>}
              {platform === Platform.IOS && <PanelHeaderSubmit onClick={saveEdit}>Сохранить</PanelHeaderSubmit>}
            </React.Fragment>
          )}
          after={(
            <React.Fragment>
              {(platform === Platform.ANDROID || platform === Platform.VKCOM) && <PanelHeaderSubmit onClick={saveEdit}>Сохранить</PanelHeaderSubmit>}
              {platform === Platform.IOS && <PanelHeaderButton aria-label="Назад" onClick={methods.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
            </React.Fragment>
          )}
        />
      }
    >
      <Group header={<Header>Статус</Header>}>
        <SubnavigationGrid>
          { types[TABS_ANIME].filter(i => i.key !== 'all').map(tab =>
            <SubnavigationButton aria-controls={tab.label} selected={tab.key === fields.list} key={tab.key} onClick={() => changeField('list', tab.key)}>{tab.label}</SubnavigationButton>
          ) }
        </SubnavigationGrid>
      </Group>
      <Group>
        <Header aside={progressIndicator}>Прогресс</Header>
        <FormItem>
          <Slider
            step={1}
            min={0}
            max={Number(data.series.total)}
            value={Number(fields.progress)}
            onChange={(value) => changeField('progress', value)}
          />
        </FormItem>
      </Group>
      <Group>
        <Header aside={ratingIndicator}>Рейтинг</Header>
        <FormItem>
          <Slider
            step={1}
            min={0}
            max={10}
            value={Number(fields.rating)}
            onChange={(value) => changeField('rating', value)}
          />
        </FormItem>
      </Group>
      <Group header={<Header>Даты</Header>}>
        <FormItem top="Начало просмотра">
          <DateInput value={fields.date_start} onChange={(value) => changeField('date_start', value)} enableTime={false} disableFuture={true} />
        </FormItem>
        <FormItem top="Конец просмотра">
          <DateInput value={fields.date_end} onChange={(value) => changeField('date_end', value)} enableTime={false} disableFuture={true} />
        </FormItem>
      </Group>
      { preferences.debug &&
        <Group header={<Header>Отладка</Header>}>
          <pre>{JSON.stringify(fields, null, 2) }</pre>
        </Group>
      }
      { data.list &&
        <Group>
          <CellButton mode="danger" before={ <Icon20TrashSmileOutline /> } onClick={removeTitle}>
            Удалить из списка
          </CellButton>
        </Group>
      }
    </ModalPage>
  );
}

export default withModalRootContext(ModalPageTitleEdit)
  