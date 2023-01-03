import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { Epic, Tabbar, TabbarItem } from '@vkontakte/vkui'
import { Icon28GridLayoutOutline, Icon28ListBulletSquareOutline, Icon28MoreHorizontal, Icon28SearchStarsOutline } from '@vkontakte/icons'

import NavigationContext from '@contexts/navigator'
import { Stories, Views, Panels } from '@services/const'

const MainStory = ({ children, activeView }) => {
  const navigations = useContext(NavigationContext)

  const mainTabbar = (
    <Tabbar>
      <TabbarItem
        onClick={() => navigations.go(Stories.Main, Views.Main.Overview, Panels.Main.Overview.Main)}
        selected={activeView === Views.Main.Overview}
        text="Обзор"
      ><Icon28GridLayoutOutline /></TabbarItem>
      <TabbarItem
        onClick={() => navigations.go(Stories.Main, Views.Main.Search, Panels.Main.Search.Main)}
        selected={activeView === Views.Main.Search}
        text="Поиск"
      ><Icon28SearchStarsOutline /></TabbarItem>
      <TabbarItem
        onClick={() => navigations.go(Stories.Main, Views.Main.List, Panels.Main.List.Main)}
        selected={activeView === Views.Main.List}
        text="Список"
      ><Icon28ListBulletSquareOutline /></TabbarItem>
      <TabbarItem
        onClick={() => navigations.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Main)}
        selected={activeView === Views.Main.Etc}
        text="Еще"
      ><Icon28MoreHorizontal /></TabbarItem>
    </Tabbar>
  )

  return (
    <Epic activeStory={activeView} tabbar={mainTabbar}>
      { children }
    </Epic>
  )
}

MainStory.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ])
}
  
export default MainStory
  