import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DefaultNavigationState } from "../services/const"

import bridge from '@vkontakte/vk-bridge';

/**
 * Моя собственная реализация навигации между экртанами.
 * Да, не идеально, но мои потребности покрывает на все сто, о-о-о.
 * 
 * @version 1.0.4
 */
const NavigationContext = React.createContext(null)

export const NavigationProvider = ({ children }) => {
  // История -- главная штука. Внутри нее происходят уже смены View и Panels внутри View
  const [activeStory, setActiveStory] = useState(DefaultNavigationState.activeStory)
  const [activeViews, setActiveViews] = useState(DefaultNavigationState.activeViews)
  const [viewActivePanels, setViewActivePanels] = useState(DefaultNavigationState.viewActivePanels)

  const [activeModal, setActiveModal] = useState(null)

  const [storyHistory, setStoryHistory] = useState(DefaultNavigationState.storyHistory)
  const [viewsHistory, setViewsHistory] = useState(DefaultNavigationState.viewsHistory)
  const [modalHistory, setModalHistory] = useState([])

  /**
   * Переход между экртанами и панелями
   * @param {string} _story  Активный экран истррии
   * @param {string} _view   Активный вид активного экрана
   * @param {string} _panel  Активная панель активного вида активного экрана
   */
  const go = (_story, _view = activeViews[_story], _panel = viewActivePanels[_view]) => {
    let _storyHistory = storyHistory ? [...storyHistory] : []

    if (_story === null) {
        _storyHistory = []
    } else if (_storyHistory.indexOf(_story) !== -1) {
        _storyHistory = _storyHistory.splice(0, _storyHistory.indexOf(_story) + 1)
    } else {
        _storyHistory.push(_story)
    }

    // Да-да-да
    let _viewsHistory = viewsHistory[_view] ? [...viewsHistory[_view]] : []

    if (_panel === null) {
      _viewsHistory = []
    } else if (_viewsHistory.indexOf(_panel) !== -1) {
      _viewsHistory = _viewsHistory.splice(0, _viewsHistory.indexOf(_panel) + 1);
    } else {
      _viewsHistory.push(_panel)
    }

    setStoryHistory(_storyHistory)
    setActiveStory(_story)

    setActiveViews({...activeViews, [_story]: _view})
  
    setViewsHistory({...viewsHistory, [_view]: _viewsHistory})
    setViewActivePanels({...viewActivePanels, [_view]: _panel})
  }

  /**
   * Открытие модального окна
   * @param {string} activeModal Активное модальное окно
   */
  const openModal = (_modal = null) => {
    let _modalHistory = modalHistory ? [...modalHistory] : [];
  
    if (_modal === null) {
      _modalHistory = [];
    } else if (_modalHistory.indexOf(_modal) !== -1) {
      _modalHistory = _modalHistory.splice(0, _modalHistory.indexOf(_modal) + 1);
    } else {
      _modalHistory.push(_modal);
    }

    setModalHistory(_modalHistory)
    setActiveModal(_modal)
  }

  /**
   * Получает активную вьюшку в Истории
   * @param {string} _story Нужная история. Если нету - используем акттивную
   * @returns {string}
   */
  const activeView = (_story = activeStory) => {
    return activeViews[_story]
  }

  /**
   * Получает историю панелей вьюшек
   * @param {string} _view 
   * @returns {string}
   */
  const viewHistory = (_view = activeView(activeStory)) => {
    return viewsHistory[_view]
  }

  /**
   * Получает активную панель во Вьюшке
   * @param {string} _view Нужная вьюшка. Если нету - используем акктивную
   * @returns {string}
   */
  const viewActivePanel = (_view = activeView(activeStory)) => {
    return viewActivePanels[_view] || []
  }


  /**
   * Кнопки навигации назад
   */

  const modalBack = () => {
    openModal(modalHistory[modalHistory.length - 2])
  }

  const storyBack = () => {
    go(storyHistory[storyHistory.length - 2])
  }

  const viewPanelBack = () => {
    let _history = viewHistory()
    go(activeStory, activeView(), _history[_history.length - 2])
  }


 const isFirst = viewActivePanel().length === 1

 useEffect(() => {
   bridge.send("VKWebAppSetSwipeSettings", { history: isFirst })
 }, [isFirst])

  return (
    <NavigationContext.Provider
      value={{
        activeStory,
        activeModal,

        activeView,
        viewHistory,
        viewActivePanel,

        // Методы Навигации по приложению
        go,
        openModal,
        modalBack,
        storyBack,
        viewPanelBack
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

NavigationProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ])
}

export default NavigationContext