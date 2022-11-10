import React, { useState, useContext } from 'react'
import { Panel, PanelHeader, PanelHeaderBack, FormLayout, FormItem, Select, Textarea, Button, Checkbox, Link, Alert } from '@vkontakte/vkui'

import { Stories, Views, Panels } from  "../../services/const";
import PreferencesContext from '../../contexts/preferences'

import { utils } from '../../services/api';

const FeedbackPanel = ({ methods }) => {
  const preferences = useContext(PreferencesContext)
  const [ fetching, setFetching ] = useState(false)

  const options = [
    { value: "1", label: "Ошибка в приложении" },
    { value: "2", label: "Добавить тайтл" },
    { value: "3", label: "Корректировка тайтла" }
  ];

  const [ fields, setFileds ] = useState({
    type: '',
    message: '',
    agree: false
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFileds(prevState => ({
        ...prevState,
        [name]: value
    }))
  }

  const handleCloseAlert = () => {
    methods.openPopout(null)
  }

  const alert_success = text => {
    let actions = [
      { title: 'Закрыть', autoClose: true, mode: 'default', action: methods.storyBack },
    ]
    return <Alert
      actionsLayout="horizontal"
      header="Успешно"
      text={text}
      actions={actions}
      onClose={handleCloseAlert} />
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
      onClose={handleCloseAlert} />
  }

  const sendFeedback = () => {
    setFetching(true)
    utils.feedback(fields)
    .then(data => {
      setFetching(false)
      methods.openPopout(alert_success("Ваше обращение успешно отправлено, спасибо"))
    })
    .catch(error => {
      setFetching(false)
      methods.openPopout(alert_error("Невозможно отправить запрос, попробуйте позднее"))
    })
  }

  const closePanel = () => {
    methods.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Main)
  }

  return (
    <Panel>
      <PanelHeader separator={false}
        before={
          <PanelHeaderBack onClick={closePanel} />
        }
      >Обратная связь</PanelHeader>
      <FormLayout>
        <FormItem top="Тип обращения">
          <Select
            placeholder="Выбрать причину"
            options={options}
            name="type"
            onChange={handleChange}
          />
        </FormItem>
        <FormItem top="Описание проблемы/предложения">
          <Textarea rows={9} name="message" onChange={handleChange} />
        </FormItem>
        <Checkbox name="agree" value={fields.agree} onChange={handleChange}>
          Согласен со всем <Link>этим</Link>
        </Checkbox>
        <FormItem>
          <Button size="l" stretched loading={fetching} onClick={sendFeedback}>
            Отправить
          </Button>
        </FormItem>
        { preferences.debug &&
          <FormItem top="Отладка">
            <pre>{JSON.stringify(fields, null, 2) }</pre>
          </FormItem>
        }
      </FormLayout>
    </Panel>
  )
}

export default FeedbackPanel;
  