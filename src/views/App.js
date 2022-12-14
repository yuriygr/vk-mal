import React, { useState, useContext, useEffect } from 'react';
import {
  AppRoot, ModalRoot, SplitLayout, Placeholder,
  View, Panel, List, Cell, Header, Group, Spacing, CardGrid, CardScroll, Tabs, TabsItem, HorizontalScroll,
  PanelHeader, PanelHeaderButton, PanelHeaderContent, PanelHeaderContext,
  PullToRefresh, Footer, Link, Button
} from '@vkontakte/vkui';
import {
  Icon16Dropdown, Icon24Done, Icon24LikeOutline, Icon28VideoSquareOutline, Icon28BookOutline, Icon28MagicWandOutline, Icon28SlidersOutline
} from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge'

// Мои штуки
import UserContext from '@contexts/user'
import PreferencesContext from '@contexts/preferences'
import NavigationContext from '@contexts/navigator'

import { GenreThumb } from '../components/genres'
import { TitleThumb, TitleListItem } from '../components/titles'
import HelloBlock from '../components/hello'

import { MainStory, TitleStory, SecretStory } from '@views/stories'
import { OverviewSuggestPanel, OverviewHelloPanel } from '@views/panels/overview'
import { SearchMainPanel } from '@views/panels/search'
import { EtcMainPanel, EtcFeedbackPanel, EtcTestsPanel, EtcDonatePanel, EtcImportPanel } from '@views/panels/etc'

import { ModalPageTitleEdit, ModalPageSearchFilter, ModalPageSuggestFilter } from '@views/modals'

import { Stories, Views, Panels, Modals, LIST_TABS, TABS_ANIME, TABS_MANGA } from '@services/const'
import Api from '@services/api'

import "@vkontakte/vkui/dist/vkui.css"

const App = () => {
  const user = useContext(UserContext)
  const preferences = useContext(PreferencesContext)
  const navigations = useContext(NavigationContext)

  const [overviewData, setOverviewData] = useState([])

  const [ searchQuery, setSearchQuery ] = useState('')

  const [activeTitle, setActiveTitle] = useState({})

  const [listData, setListData] = useState([])
  const [activeListType, setActiveListType] = useState(TABS_ANIME)
  const [activeListTab, setActiveListTab] = useState('all')
  const [activeListTabs, setActiveListTabs] = useState(LIST_TABS[TABS_ANIME])
  
  const [listContextOpened, setListContextOpened] = useState(false)
  const [listTabs, setListTabs] = useState(LIST_TABS)

  const [popout, setPopout] = useState(null)
  const [fetching, setFetching] = useState({
    overview: false, list: false
  })
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
        default:
          break;
      }
    })
  }

  const updateActiveTitle = (params) => {
    setActiveTitle(prev => ({
      ...prev,
      ...params
    }))
  }

  // Загрузка главной страницы
  const fetchOverview = (init = false) => {
    setFetching({ ...fetching, overview: true })

    Api.my.overview()
    .then(data => 
      setOverviewData(data.sections)
    )
    .catch(error => setError(error))
    .then(_ => setFetching({ ...fetching, overview: false }))
  }

  // Загрузка списка
  const fetchList = (init = false) => {
    setFetching({ ...fetching, list: true })

    Api.my.list.get(activeListType, { list: activeListTab, page: 1 })
    .then(data => 
      setListData(prevState => ({
        ...prevState,
        [activeListType + '-' + activeListTab]: data
      }))
    )
    .catch(error => setError(error))
    .then(_ => setFetching({ ...fetching, list: false }))
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

  const changeListTab = (key) => {
    setActiveListTab(key)
  }

  const changeListType = (key) => {
    setActiveListType(key)
    setActiveListTabs(listTabs[key])
    setActiveListTab('all')

    requestAnimationFrame(toggleListContext)
  }

  useEffect(() => {
    watchBridge()
    fetchOverview()
  }, [])

  useEffect(() => {
    fetchList()
  }, [activeListTab, activeListType])

  const refreshOverview = () => {
    fetchOverview()
  }

  const refreshList = () => {
    fetchList()
  }

  const loadMoreList = () => {

  }
 
  const overviewSuggestButton = (
    <PanelHeaderButton aria-label="Что посмотреть" onClick={() => navigations.go(Stories.Main, Views.Main.Overview, Panels.Main.Overview.Suggest)}><Icon28MagicWandOutline /></PanelHeaderButton>
  )

  const listFilterButton = (
    <PanelHeaderButton aria-label="Фильтр" onClick={() => navigations.openModal(Modals.SearchFilter)}><Icon28SlidersOutline /></PanelHeaderButton>
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

  const activeListData = (
     listData[activeListType + '-' + activeListTab] || {}
  )

  const listTabItem = (tab) => {
    return <TabsItem
      aria-controls={tab.label}
      key={tab.key}
      onClick={() => changeListTab(tab.key)}
      selected={activeListTab === tab.key}
    >{tab.label}</TabsItem>
  }

  const listSecretTabItem = (
    <TabsItem
      aria-controls='Секрет'
      onClick={() => navigations.go(Stories.Secret)}
      selected={activeListTab === 'secret'}
    ><Icon24LikeOutline style={{ color: 'var(--vkui--color_icon_negative)' }} /></TabsItem>
  )

  const titleListItem = (title) => {
    const _key = 'list-item-' + title.anime_id
    return <TitleListItem key={_key} data={title} onClick={() => fetchTitle(title)} />
  }

  
  const emptyPlaceholder = (message) => {
    return <Placeholder>{message}</Placeholder>
  }

  // Методы что мы передаем во все охуительные истории
  const _methods = {
    go: navigations.go,
    storyBack: navigations.storyBack,
    viewPanelBack: navigations.viewPanelBack,
    openModal: navigations.openModal,
    modalBack: navigations.modalBack,
    openPopout: openPopout,
    fetchTitle: fetchTitle
  }

  const modal = (
    <ModalRoot activeModal={navigations.activeModal} onClose={navigations.modalBack}>
      <ModalPageTitleEdit     dynamicContentHeight settlingHeight={100} id={Modals.TitleEdit}     methods={_methods} data={activeTitle} updateData={updateActiveTitle} />
      <ModalPageSearchFilter  dynamicContentHeight settlingHeight={100} id={Modals.SearchFilter}  methods={_methods} />
      <ModalPageSuggestFilter dynamicContentHeight settlingHeight={100} id={Modals.SuggestFilter} methods={_methods} />
    </ModalRoot>
  )

  return (
    <AppRoot>
      <SplitLayout modal={modal} popout={popout}>

        <View activePanel={navigations.activeStory}>
          <MainStory id={Stories.Main} activeView={navigations.activeView(Stories.Main)}>
            <View id={Views.Main.Overview}
              activePanel={navigations.viewActivePanel(Views.Main.Overview)}
              history={navigations.viewHistory(Views.Main.Overview)}
              onSwipeBack={navigations.viewPanelBack}
            >
              <Panel id={Panels.Main.Overview.Main}>
                <PanelHeader separator={false} before={overviewSuggestButton}>Обзор</PanelHeader>                          
                <PullToRefresh onRefresh={refreshOverview} isFetching={fetching.overview}>
                  <HelloBlock methods={_methods} />
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

              <OverviewSuggestPanel id={Panels.Main.Overview.Suggest} methods={_methods} />
              <OverviewHelloPanel   id={Panels.Main.Overview.Hello}   methods={_methods} />
            </View>
        
            <View id={Views.Main.Search} activePanel={navigations.viewActivePanel(Views.Main.Search)}>
              <SearchMainPanel id={Panels.Main.Search.Main} methods={_methods} query={searchQuery} setQuery={setSearchQuery} />
            </View>
        
            <View id={Views.Main.List} activePanel={navigations.viewActivePanel(Views.Main.List)}>
              <Panel id={Panels.Main.List.Main}>
                <PanelHeader separator={false} before={listFilterButton}>
                  <PanelHeaderContent
                    aside={ <Icon16Dropdown style={{ transform: `rotate(${ listContextOpened ? "180deg" : "0" })`}} /> }
                    onClick={toggleListContext}
                  >
                    { activeListType === TABS_ANIME ? 'Список аниме' : 'Список манги' }
                  </PanelHeaderContent>
                </PanelHeader>
                <PanelHeaderContext opened={listContextOpened} onClose={toggleListContext}>
                  { listHeaderContext }
                </PanelHeaderContext>
                <Tabs>
                  <HorizontalScroll>
                    { activeListTabs.map(tab => listTabItem(tab)) }
                    { preferences.debug && listSecretTabItem }
                  </HorizontalScroll>
                </Tabs>
                
                <PullToRefresh onRefresh={refreshList} isFetching={fetching.list}>
                  { activeListData.total === 0 &&
                    emptyPlaceholder("На данный момент, у вас не добавлено ни " + ( activeListType === TABS_ANIME ? 'одного аниме' : 'одной манги' ) + " в список!")
                  }
                  { activeListData.total > 0 &&
                    <React.Fragment>
                      <Spacing size={16} />
                      <CardGrid size="l">
                        { activeListData.items.map(title => titleListItem(title)) }
                      </CardGrid>
                      { (activeListData.items.length < activeListData.total) &&
                        <div style={{ padding: 'var(--vkui--size_base_padding_horizontal--regular)'}}>
                          <Button onClick={loadMoreList} stretched mode="secondary" size="m">Загрузить еще</Button>
                        </div>
                      }
                      <Footer>{ activeListData.items.length } из { activeListData.total } записей</Footer>
                    </React.Fragment>
                  }
                </PullToRefresh>
              </Panel>
            </View>

            <View id={Views.Main.Etc}
              activePanel={navigations.viewActivePanel(Views.Main.Etc)}
              history={navigations.viewHistory(Views.Main.Etc)}
              onSwipeBack={navigations.viewPanelBack}
            >
              <EtcMainPanel     id={Panels.Main.Etc.Main}     methods={_methods} />
              <EtcFeedbackPanel id={Panels.Main.Etc.Feedback} methods={_methods} />
              <EtcDonatePanel   id={Panels.Main.Etc.Donate}   methods={_methods} />
              <EtcTestsPanel    id={Panels.Main.Etc.Tests}    methods={_methods} />
              <EtcImportPanel   id={Panels.Main.Etc.Import}   methods={_methods} />
            </View>
          </MainStory>
            
          <SecretStory id={Stories.Secret} methods={_methods} />
          <TitleStory  id={Stories.Title}  methods={_methods} data={activeTitle}
            activeView={navigations.activeView(Stories.Title)}
          />
        </View>

      </SplitLayout>
    </AppRoot>
  );
}

export default App;