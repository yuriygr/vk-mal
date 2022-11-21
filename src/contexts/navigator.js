import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DefaultNavigationState } from "../services/const"
import { func } from 'prop-types'

const NavigationContext = React.createContext(null)

/**
 * Моя собственная реализация навигации между экртанами.
 * Да, не идеально, но мои потребности покрывает на все сто, о о о.
 * 
 * @vesion 1.0.2
 */
export const NavigationProvider = ({ children }) => {
  // История -- главная штука. Внутри нее происходят уже смены View и Panels внутри View
  const [activeStory, setActiveStory] = useState(DefaultNavigationState.activeStory)
  const [activeViews, setActiveViews] = useState(DefaultNavigationState.activeViews)
  const [activePanels, setActivePanels] = useState(DefaultNavigationState.activePanels)

  const [activeModal, setActiveModal] = useState(null)

  const [storyHistory, setStoryHistory] = useState(DefaultNavigationState.storyHistory)
  const [modalHistory, setModalHistory] = useState([])

  /**
   * Переход между экртанами и панелями
   * @param {string} _story  Активный экран истррии
   * @param {string} _view   Активный вид активного экрана
   * @param {string} _panel  Активная панель активного вида активного экрана
   */
  const go = (_story, _view = activeViews[_story], _panel = activePanels[_view]) => {
    let _storyHistory = storyHistory ? [...storyHistory] : [];

    if (_story === null) {
        _storyHistory = [];
    } else if (_storyHistory.indexOf(_story) !== -1) {
        _storyHistory = _storyHistory.splice(0, _storyHistory.indexOf(_story) + 1);
    } else {
        _storyHistory.push(_story);
    }

    setStoryHistory(_storyHistory)
    setActiveStory(_story)
    setActiveViews({...activeViews, [_story]: _view})
    setActivePanels({...activePanels, [_view]: _panel})
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

  const modalBack = () => {
    openModal(modalHistory[modalHistory.length - 2])
  };

  const storyBack = () => {
    go(storyHistory[storyHistory.length - 2])
  }

  return (
    <NavigationContext.Provider
      value={{
        activeStory,
        activeViews,
        activePanels,

        // Модальные окна
        activeModal,

        // Методы роутинга
        go,
        openModal,
        modalBack,
        storyBack
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