import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Platform, withModalRootContext, 
  ModalPage, ModalPageHeader, PanelHeaderButton, usePlatform, FormItem, ChipsInput, IconButton, Select, Button, FormLayout, FormLayoutGroup
} from '@vkontakte/vkui'
import { Icon16Clear, Icon24Cancel, Icon24Dismiss } from '@vkontakte/icons'

import PreferencesContext from "@contexts/preferences"

/**
 * Модалка что фильтует базар
 */
const ModalPageEntriesFilter = ({ id, data, updateData, methods }) => {
  const platform = usePlatform()
  const preferences = useContext(PreferencesContext)

  const [ fields, setFileds ] = useState({
    tags: data.tags || [],
    type: data.type || '',
    source: data.source || '',
    status: data.status || '',
    premiered_season: data.premiered_season || '',
    premiered_year: data.premiered_year || '',
  })

  const updateFields = (params) =>
    setFileds(prevState => ({ ...prevState, ...params }))

  const showResult = () => {
    updateData(fields)
    methods.modalBack()
  }

  const clearTags = () => {
    updateFields({ tags: [] })
  }

  const clearFilter = () => {
    updateData({
      tags: [],
      type: '',
      source: '',
      status: '',
      premiered_season: '',
      premiered_year: '',
    })
    methods.modalBack()
  }

  const types = () => {
    let types = ['ova', 'ona', 'tv', 'movie', 'special', 'music']

    return types.map((i) => ({
      label: i,
      value: i,
    }))
  }

  const sources = () => {
    let types = ['game','manga','original','novel','visual novel','light novel','other','book','web manga','picture book','4-koma manga','unknown']

    return types.map((i) => ({
      label: i,
      value: i,
    }))
  }

  const statuses = () => {
    let statuses = ['currently', 'finished', 'not-yet']

    return statuses.map((i) => ({
      label: i,
      value: i,
    }))
  }

  const years = () => {
    var max = new Date().getFullYear()
    var min = 1961
    var years = []
  
    for (var i = max; i >= min; i--) {
      years.push(i.toString())
    }
    return years.map((i) => ({
      label: i,
      value: i,
    }))
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
      <FormLayout>
        <FormItem top="Теги">
          <ChipsInput
            placeholder="Выберите теги"
            value={fields.tags}
            after={
              <IconButton
                hoverMode="opacity"
                aria-label="Очистить поле"
                onClick={clearTags}
              >
                <Icon16Clear />
              </IconButton>
            }
          />
        </FormItem>
        <FormItem top="Тип">
          <Select
            placeholder="Выберите тип"
            defaultValue=""
            value={fields.type}
            onChangeCapture={(e) => updateFields({ type: e.target.value })}
            options={types()}
          />
        </FormItem>
        <FormItem top="Источник">
          <Select
            placeholder="Выберите источник"
            defaultValue=""
            value={fields.source}
            onChangeCapture={(e) => updateFields({ source: e.target.value })}
            options={sources()}
          />
        </FormItem>
        <FormItem top="Статус">
          <Select
            placeholder="Выберите статус"
            defaultValue=""
            value={fields.status}
            onChangeCapture={(e) => updateFields({ status: e.target.value })}
            options={statuses()}
          />
        </FormItem>
        <FormLayoutGroup mode="horizontal" segmented>
          <FormItem top="Дата преьмеры">
            <Select
              placeholder="Сезон"
              defaultValue=""
              value={fields.premiered_season}
              onChangeCapture={(e) => updateFields({ premiered_season: e.target.value })}
              options={[
                { label: "Весна", value: "spring" },
                { label: "Лето", value: "summer" },
                { label: "Осень", value: "fall" },
                { label: "Зима", value: "winter" },
              ]}
            />
          </FormItem>
          <FormItem>
            <Select
              placeholder="Год"
              defaultValue=""
              value={fields.premiered_year}
              onChangeCapture={(e) => updateFields({ premiered_year: e.target.value })}
              options={years()}
            />
          </FormItem>
        </FormLayoutGroup>
        <FormItem>
          <Button onClick={showResult} size="l" stretched>
            Применить
          </Button>
        </FormItem>
        { preferences.debug &&
          <FormItem top="Отладка">
            <pre>{JSON.stringify(fields, null, 2) }</pre>
          </FormItem>
        }
      </FormLayout>
    </ModalPage>
  )
}

ModalPageEntriesFilter.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object,
  //updateData: PropTypes.funс,
  methods: PropTypes.object
}

export default withModalRootContext(ModalPageEntriesFilter)
  