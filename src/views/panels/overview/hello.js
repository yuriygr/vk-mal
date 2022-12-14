import React from 'react'
import PropTypes from 'prop-types'

import { Panel, PanelHeader, PanelHeaderBack, Paragraph, Spacing, Title } from '@vkontakte/vkui'

const OverviewHelloPanel = ({ methods }) => {
  return (
    <Panel>
      <PanelHeader separator={false}
        before={
          <PanelHeaderBack onClick={methods.viewPanelBack} />
        }
      >Приветствую</PanelHeader>
      <div style={{ padding: 20 }}>
        <Paragraph weight="1">
          Сразу обмолвимся, приложение еще в процессе, что-то может выглядет не столь красиво или работать плохо.
        </Paragraph>
        <Spacing size={26} />
        <Title level="2">Что уже точно работает</Title>
        <Spacing size={16} />
        <Paragraph>
          <b>Список аниме.</b> Но отображает только последние 15 тайтлов. Надо доделать постраничную навигацию.
        </Paragraph>
        <Spacing size={16} />
        <Paragraph>
          <b>Карточка аниме.</b> Маленький прямоугольник в поиске и списке.
        </Paragraph>
        <Spacing size={16} />
        <Paragraph>
          <b>Страница аниме.</b> В общем и целом работает, но не хватает информации.
        </Paragraph>
        <Spacing size={16} />
        <Paragraph>
          <b>Рекомендации что посмотреть.</b> Не целиком, конечно, ибо выводится только случайное аниме без учета предпочтений пользователя.
        </Paragraph>
        <Spacing size={26} />
        <Title level="2">Что точно не работает</Title>
        <Spacing size={16} />
        <Paragraph>
          <b>Поиск.</b> Моя самая большая проблема во всех домашних проектах.
        </Paragraph>
        <Spacing size={16} />
        <Paragraph>
          <b>Перевод.</b> Часть текста на английском. Все заголовки аниме тоже на английском.
        </Paragraph>
      </div>
    </Panel>
  )
}

OverviewHelloPanel.propTypes = {
  methods: PropTypes.object
}

export default OverviewHelloPanel
  