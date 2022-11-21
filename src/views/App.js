import React, { useState, useContext, useEffect } from 'react';
import {
  AppRoot, ModalRoot, Epic, SplitLayout, Placeholder,
  Tabbar, TabbarItem,
  View, Panel, List, Cell, Header, Group, Spacing, CardGrid, CardScroll, ScreenSpinner, Tabs, TabsItem, HorizontalScroll,
  
  PanelHeader, PanelHeaderContent, PanelHeaderContext,
  PullToRefresh, Footer, Link, Search,

  AdaptivityProvider, ConfigProvider, SimpleCell, Switch, PanelHeaderButton,
} from '@vkontakte/vkui';
import {
  Icon16Dropdown, Icon24Done,
  Icon28SearchStarsOutline,
  Icon28GridLayoutOutline,
  Icon28HorseToyOutline, Icon24LikeOutline, Icon28VideoSquareOutline, Icon28BookOutline, Icon28ListBulletSquareOutline, Icon28MoreHorizontal, Icon28QuestionOutline, Icon28MoneyCircleOutline, Icon28HieroglyphCharacterOutline, Icon28BracketsSlashSquareOutline, Icon28BugOutline, Icon28MagicWandOutline
} from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

// Мои штуки
import UserContext from '../contexts/user'
import PreferencesContext from '../contexts/preferences'
import NavigationContext from '../contexts/navigator';

import { GenreThumb } from '../components/genres';
import { TitleThumb, TitleListItem } from '../components/titles';
import { TitleStory, SecretStory } from '../views/stories';
import { SuggestPanel, FeedbackPanel, TestsPanel, DonatePanel } from '../views/panels';
import { ModalPageTitleEdit } from '../views/modals';
import { Stories, Views, Panels, TITLE_EDIT_MODAL, LIST_TABS, TABS_ANIME, TABS_MANGA } from "../services/const";
import Api, { mySearch } from '../services/api';

import "@vkontakte/vkui/dist/vkui.css";

const App = () => {
  const user = useContext(UserContext)
  const preferences = useContext(PreferencesContext)
  const navigations = useContext(NavigationContext)

  const [overviewData, setOverviewData] = useState([])

  const [activeTitle, setActiveTitle] = useState({})

  const [searchQuery, setSearchQuery] = useState('')
  const [searchData, setSearchData] = useState([])

  const [listData, setListData] = useState([])
  const [activeListType, setActiveListType] = useState(TABS_ANIME)
  const [activeListTab, setActiveListTab] = useState('all')
  const [activeListTabs, setActiveListTabs] = useState(LIST_TABS[TABS_ANIME])
  
  const [listContextOpened, setListContextOpened] = useState(false)
  const [listTabs, setListTabs] = useState(LIST_TABS)

  const [popout, setPopout] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState(false)

  /**
   * Открытие пупышек
   * @param {string} popout Активная пупышка
   */
  const openPopout = (popout = null) => {
    setPopout(popout)
  }

  // Смотрим за событиями моста
  const watchBridge = () => {
    bridge.subscribe((e) => {
      switch (e.detail.type) {
        case 'VKWebAppUpdateConfig':
          preferences.setAppearance(e.detail.data.appearance)
          break;
      
        default:
          break;
      }
    })
  }

  // Загрузка главной страницы
  const fetchOverview = () => {
    setFetching(true)
    setPopout(<ScreenSpinner />)

    Api.my.overview()
    .then(data => {
      setOverviewData(data.sections)
      setFetching(false)
      setPopout(null)
    })
    .catch(error => {
      setError(error)
      setFetching(false)
      setPopout(null)
    })
  }

  // Загрузка списка
  const fetchList = () => {
    setFetching(true)
    setPopout(<ScreenSpinner />)

    Api.my.list(activeListType, {
      list: activeListTab,
      page: 1
    })
    .then(data => {
      listData[activeListType + '-' + activeListTab] = data
      setListData(listData)
      setFetching(false)
      setPopout(null)
    })
    .catch(error => {
      setError(error)
      setFetching(false)
      setPopout(null)
    })
  }

  // Открытие панели с тайтлом
  const fetchTitle = (title) => {
    setActiveTitle(title)
    navigations.go(Stories.Title)
  }

  // Открытие панели с жанром
  const fetchGenre = (genre) => {
    setSearchQuery(genre.names.english_name)
    navigations.go(Stories.Main, Views.Main.Search)
  }

  const toggleListContext = () => {
    setListContextOpened(!listContextOpened)
  }

  const changeListTab = async (key) => {
    setActiveListTab(key)
    fetchList()
  }

  const changeListType = async (key) => {
    setActiveListType(key)
    setActiveListTabs(listTabs[key])
    setActiveListTab('all')
    fetchList()

    requestAnimationFrame(toggleListContext)
  }

  useEffect(() => {
    watchBridge()
    fetchOverview()
    fetchList()
  }, [])


  const changeSearchQuery = (e) => {
    setSearchQuery(e.target.value)
    mySearch.get({ query: e.target.value })
    .then(data => {
      setSearchData(data)
      setFetching(false)
      setPopout(null)
    })
    .catch(error => {
      setError(error)
      setFetching(false)
      setPopout(null)
    })
  }

  const refreshOverview = async () => {
    await this.fetchOverview()
  }

  const refreshList = async () => {
    await this.fetchList()
  }

  const mainTabbar = (
    <Tabbar>
      <TabbarItem
        onClick={() => navigations.go(Stories.Main, Views.Main.Overview, Panels.Main.Overview.Main)}
        selected={navigations.activeViews[Stories.Main] === Views.Main.Overview}
        text="Обзор"
      ><Icon28GridLayoutOutline /></TabbarItem>
      <TabbarItem
        onClick={() => navigations.go(Stories.Main, Views.Main.Search, Panels.Main.Search.Main)}
        selected={navigations.activeViews[Stories.Main] === Views.Main.Search}
        text="Поиск"
      ><Icon28SearchStarsOutline /></TabbarItem>
      <TabbarItem
        onClick={() => navigations.go(Stories.Main, Views.Main.List, Panels.Main.List.Main)}
        selected={navigations.activeViews[Stories.Main] === Views.Main.List}
        text="Список"
      ><Icon28ListBulletSquareOutline /></TabbarItem>
      <TabbarItem
        onClick={() => navigations.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Main)}
        selected={navigations.activeViews[Stories.Main] === Views.Main.Etc}
        text="Еще"
      ><Icon28MoreHorizontal /></TabbarItem>
    </Tabbar>
  )

  const modal = (
    <ModalRoot activeModal={navigations.activeModal} onClose={navigations.modalBack}>
      <ModalPageTitleEdit dynamicContentHeight settlingHeight={100} id={TITLE_EDIT_MODAL} goBack={navigations.modalBack} data={activeTitle} />
    </ModalRoot>
  )

  const listHeaderContext = (
    <List>
      <Cell
        before={<Icon28VideoSquareOutline />}
        after={
          activeListType === TABS_ANIME ? (
            <Icon24Done fill="var(--accent)" />
          ) : null
        }
        onClick={() => changeListType(TABS_ANIME)}
      >
        Список аниме
      </Cell>
      <Cell
        before={<Icon28BookOutline />}
        after={
          activeListType === TABS_MANGA ? (
            <Icon24Done fill="var(--accent)" />
          ) : null
        }
        onClick={() => changeListType(TABS_MANGA)}
      >
        Список манги
      </Cell>
    </List>
  )

  const activeListData = () => {
    return listData[activeListType + '-' + activeListTab] || []
  }

  const emptyPlaceholder = (message) => {
    return <Placeholder>{message}</Placeholder>
  }

  const titleListItem = (title) => {
    const _key = 'list-item-' + title.anime_id
    return <TitleListItem key={_key} data={title} onClick={() => fetchTitle(title)} />
  }

  // Методы что мы передаем во все охуительные истории
  const _methods = {
    go: navigations.go,
    storyBack: navigations.storyBack,
    openModal: navigations.openModal,
    openPopout: openPopout
  }

  return (
    <ConfigProvider appearance={preferences.appearance}>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout modal={modal} popout={popout}>

            <View activePanel={navigations.activeStory}>
              <Epic id={Stories.Main} activeStory={navigations.activeViews[Stories.Main]} tabbar={mainTabbar}>
                <View id={Views.Main.Overview} activePanel={navigations.activePanels[Views.Main.Overview]}>
                  <Panel id={Panels.Main.Overview.Main}>
                    <PanelHeader separator={false} before={
                      <PanelHeaderButton aria-label="Что посмотреть" onClick={() => navigations.go(Stories.Main, Views.Main.Overview, Panels.Main.Overview.Suggest)}><Icon28MagicWandOutline /></PanelHeaderButton>
                    }>Обзор</PanelHeader>                          
                    <PullToRefresh
                      onRefresh={() => refreshOverview}
                      isFetching={fetching}
                    >
                      { overviewData.map(section =>
                        <Group key={'section-' + section.slug}>
                          <Header subtitle={ section.subtitle } aside={<Link>Смотреть все</Link>}>{ section.title }</Header>
                        { section.items.length === 0 &&
                          emptyPlaceholder("Тут пока-что пусто...")
                        }
                        { section.items.length > 0 && section.type === 'anime' &&
                          <React.Fragment>
                            <CardScroll size="s">
                            { section.items.map(title =>
                              <TitleThumb key={title.id} data={title} onClick={() => fetchTitle(title)} />
                            ) }
                            </CardScroll>
                          </React.Fragment>
                        }
                        { section.items.length > 0 && section.type === 'genre' &&
                          <React.Fragment>
                            <CardScroll size="s">
                            { section.items.map(item =>
                              <GenreThumb key={item.genre_id} data={item} onClick={() => fetchGenre(item)} />
                            ) }
                            </CardScroll>
                          </React.Fragment>
                        }
                        </Group>
                      ) }
                    </PullToRefresh>
                  </Panel>

                  <SuggestPanel id={Panels.Main.Overview.Suggest} methods={_methods} />
                </View>
          
                <View id={Views.Main.Search} activePanel={navigations.activePanels[Views.Main.Search]}>
                  <Panel id={Panels.Main.Search.Main}>
                    <PanelHeader separator={false}>Поиск</PanelHeader>
                    <Search
                      value={searchQuery}
                      onChange={changeSearchQuery}
                      after={null}
                    />
                    { searchQuery === '' &&
                      emptyPlaceholder("Чтобы начать искать введите в строку поиска название аниме/манги")
                    }
                    { searchQuery !== '' && searchData.length === 0 &&
                      emptyPlaceholder("По вашему запросу ничего не найдено, возможно, стоит уточнить название")
                    }
                    { searchData.length > 0 &&
                      <React.Fragment>
                        <Spacing size={16} />
                        <CardGrid size="l">
                        { searchData.map(title => titleListItem(title)) }
                        </CardGrid>
                        <Footer>{ searchData.length } записи</Footer>
                      </React.Fragment>
                    }
                  </Panel>
                </View>
          
                <View id={Views.Main.List} activePanel={navigations.activePanels[Views.Main.List]}>
                  <Panel id={Panels.Main.List.Main}>
                    <PanelHeader separator={false}>
                      <PanelHeaderContent
                        aside={
                          <Icon16Dropdown style={{ transform: `rotate(${ listContextOpened ? "180deg" : "0" })`}} />
                        }
                        onClick={toggleListContext}
                      >
                        { activeListType === TABS_ANIME ? 'Список аниме' : 'Список манги' }
                      </PanelHeaderContent>
                    </PanelHeader>
                    <PanelHeaderContext
                      opened={listContextOpened}
                      onClose={toggleListContext}
                    >
                      { listHeaderContext }
                    </PanelHeaderContext>
                    <Tabs>
                      <HorizontalScroll>
                      { activeListTabs.map(tab =>
                        <TabsItem
                          aria-controls={tab.label}
                          key={tab.key}
                          onClick={() => changeListTab(tab.key)}
                          selected={activeListTab === tab.key}
                        >{tab.label}</TabsItem>
                      ) }
                        <TabsItem
                          aria-controls='Секрет'
                          onClick={() => navigations.go(Stories.Secret)}
                          selected={activeListTab === 'secret'}
                        ><Icon24LikeOutline style={{ color: 'var(--vkui--color_icon_negative)' }} /></TabsItem>
                      </HorizontalScroll>
                    </Tabs>
                    
                    <PullToRefresh
                      onRefresh={() => refreshList}
                      isFetching={fetching}
                    >
                      { activeListData().length === 0 &&
                        <Placeholder>
                          На данный момент, у вас не добавлено ни { activeListType === TABS_ANIME ? 'одного аниме' : 'одной манги' } в список!
                        </Placeholder>
                      }
                      { activeListData().length > 0 &&
                        <React.Fragment>
                          <Spacing size={16} />
                          <CardGrid size="l">
                          { activeListData().map(title => titleListItem(title)) }
                          </CardGrid>
                          <Footer>{ activeListData().length } записи</Footer>
                        </React.Fragment>
                      }
                    </PullToRefresh>
                  </Panel>
                </View>

                <View id={Views.Main.Etc} activePanel={navigations.activePanels[Views.Main.Etc]}>
                  <Panel id={Panels.Main.Etc.Main}>
                    <PanelHeader separator={false}>Еще</PanelHeader>
                    <Group>
                      <Header>Настройки</Header>
                      <SimpleCell expandable before={<Icon28HieroglyphCharacterOutline />} indicator="Русский">Названия</SimpleCell>
                      <SimpleCell Component="label" before={<Icon28BugOutline />} after={<Switch defaultChecked />}>Режим отладки</SimpleCell>
                    </Group>
                    <Group>
                      <List>
                        <Cell expandable before={<Icon28QuestionOutline />} onClick={() => navigations.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Feedback)}>
                          Обратная связь
                        </Cell>
                        <Cell expandable before={<Icon28MoneyCircleOutline />} onClick={() => navigations.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Donate)}>
                          Поддержать
                        </Cell>
                        <Cell expandable before={<Icon28HorseToyOutline />} onClick={() => navigations.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Tests)}>
                          Проверочная
                        </Cell>
                        <SimpleCell before={<Icon28BracketsSlashSquareOutline />} component="a" target="_blank" href="https://github.com/yuriygr/vk-mal">Исходный код</SimpleCell>
                      </List>
                    </Group>
                    <Footer>Версия 1.3</Footer>
                  </Panel>

                  <FeedbackPanel id={Panels.Main.Etc.Feedback} methods={_methods} />
                  <DonatePanel   id={Panels.Main.Etc.Donate}   methods={_methods} />
                  <TestsPanel    id={Panels.Main.Etc.Tests}    methods={_methods} />
                </View>
              </Epic>
              
              <SecretStory id={Stories.Secret} methods={_methods} />
              <TitleStory  id={Stories.Title}  methods={_methods}
                activeView={navigations.activeViews[Stories.Title]}
                data={activeTitle}
              />
            </View>

          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;