import React, { useState, useContext, useEffect } from 'react'
import {
  AppRoot, ModalRoot, SplitLayout, Placeholder,
  View, Panel, List, Cell, Header, Group, Spacing, CardGrid, CardScroll, Tabs, TabsItem, HorizontalScroll,
  PanelHeader, PanelHeaderButton, PanelHeaderContent, PanelHeaderContext,
  PullToRefresh, Footer, Link, Button, Search, Badge, Counter
} from '@vkontakte/vkui'
import {
  Icon16Dropdown, Icon24Done, Icon28VideoSquareOutline, Icon28BookOutline, Icon28MagicWandOutline, Icon28SlidersOutline
} from '@vkontakte/icons'
import bridge from '@vkontakte/vk-bridge'

// Мои штуки
import UserContext from '@contexts/user'
import PreferencesContext from '@contexts/preferences'
import NavigationContext from '@contexts/navigator'

import { GenreThumb, GenreList } from '@components/genres'
import { TitleThumb, TitleListItem } from '@components/titles'

import { MainStory, TitleStory } from '@views/stories'
import { OverviewSuggestPanel } from '@views/panels/overview'
import { EtcMainPanel, EtcFeedbackPanel, EtcTestsPanel, EtcDonatePanel, EtcImportPanel } from '@views/panels/etc'

import { ModalPageTitleEdit, ModalPageEntriesFilter, ModalPageSuggestFilter } from '@views/modals'

import { Stories, Views, Panels, Modals, LIST_TABS, TABS_ANIME, TABS_MANGA } from '@services/const'
import Api from '@services/api'

const App = () => {
  const user = useContext(UserContext)
  const preferences = useContext(PreferencesContext)
  const navigations = useContext(NavigationContext)

  const [overviewData, setOverviewData] = useState([])
  const [activeTitle, setActiveTitle] = useState({})
  const [suggestFilters, setSuggestFilters] = useState({
    type: 'anime',
    list: 'all',
  })

  // Поиск
  const [searchData, setSearchData] = useState({
    items: [],
    total: 0,
    request: {}
  })
  const [searchParams, setSearchParams] = useState({
    type: 'anime',
    query: '',
  })
  const [searchFilters, setSearchFilters] = useState({
    tags: [],
    type: '',
    source: '',
    status: '',
    premiered_season: '',
    premiered_year: '',
    page: 1
  })
  const [searchContextOpened, setSearchContextOpened] = useState(false)
  
  // Список
  const [listData, setListData] = useState([])
  const [listParams, setListParams] = useState({
    type: 'anime',
    list: 'all',
  })
  const [listFilters, setListFilters] = useState({
    tags: [],
    type: '',
    source: '',
    status: '',
    premiered_season: '',
    premiered_year: '',
    page: 1
  })
  const [listContextOpened, setListContextOpened] = useState(false)

  const [popout, setPopout] = useState(null)
  const [fetching, setFetching] = useState({
    overview: false, search: false, list: false
  })
  const [errors, setErrors] = useState({
    overview: false, search: false, list: false
  })

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

  const updateActiveTitle = (params) =>
    setActiveTitle(prevState => ({ ...prevState, ...params }))

  const updateSuggestFilters = (params) =>
    setSuggestFilters(prevState => ({ ...prevState, ...params }))
    
  const updateSearchFilters = (params) =>
    setSearchFilters(prevState => ({ ...prevState, ...params }))

  const updateSearchParams = (params) =>
    setSearchParams(prevState => ({ ...prevState, ...params }))

  const updateListFilters = (params) =>
    setListFilters(prevState => ({ ...prevState, ...params }))

  const updateListParams = (params) =>
    setListParams(prevState => ({ ...prevState, ...params }))

  const updateListData = (params) => 
    setListData(prevState => ({ ...prevState, ...params }))

  const countNotEmptyFields = (obj) => {
    let counter = 0
    const emptyValues = new Set(['', null, undefined])
    const filteredFields = ['tags', 'page']

    counter += Object.keys(obj)
      .filter(key => !filteredFields.includes(key))
      .filter(key => !emptyValues.has(obj[key]))
      .length

    if (obj['tags'].length > 0) {
      counter++
    }

    return counter
  }

  // Загрузка главной страницы
  const fetchOverview = (init = false) => {
    setFetching({ ...fetching, overview: true })
    setErrors({ ...errors, overview: false })

    Api.my.overview()
    .then(data => 
      setOverviewData(data.sections)
    )
    .catch(error => setErrors({ ...errors, overview: error }))
    .then(_ => setFetching({ ...fetching, overview: false }))
  }

  // Поиск
  const fetchSearch = (init = false) => {
    setFetching({ ...fetching, search: true })
    setErrors({ ...errors, search: false })
  
    Api.catalog.search(searchParams, searchFilters)
    .then(data => 
      setSearchData(data)
    )
    .catch(error => setErrors({ ...errors, search: error }))
    .then(_ => setFetching({ ...fetching, search: false }))
  }

  // Загрузка списка
  const fetchList = (init = false) => {
    setFetching({ ...fetching, list: true })
    setErrors({ ...errors, list: false })

    Api.my.list.get(listParams, listFilters)
    .then(data => 
      updateListData({ [listParams.type + '-' + listParams.list]: data })
    )
    .catch(error => setErrors({ ...errors, list: error }))
    .then(_ => setFetching({ ...fetching, list: false }))
  }

  // Открытие панели с тайтлом
  const openTitle = (title) => {
    setActiveTitle(title)
    navigations.go(Stories.Title)
  }

  // Открытие панели с жанром
  const fetchGenre = (genre) => {
    updateSearchFilters({ tags: [ ...searchFilters.tags, { value: genre.genre_id, label: genre.names.english_name } ] })
    navigations.go(Stories.Main, Views.Main.Search)
  }

  const changeSearchQuery = (e) => {
    updateSearchParams({ query: e.target.value })
  }

  const toggleListContext = () => {
    setListContextOpened(!listContextOpened)
  }

  const toggleSearchContext = () => {
    setSearchContextOpened(!searchContextOpened)
  }

  const changeListTab = (key) => {
    updateListParams({ list: key })
    updateListFilters({ page: 1 })
  }

  const changeListType = (key) => {
    updateListParams({ type: key, list: 'all' })
    updateListFilters({ page: 1 })

    requestAnimationFrame(toggleListContext)
  }

  const changeSearchType = (key) => {
    updateSearchParams({ type: key })
    updateSearchFilters({ page: 1 })

    requestAnimationFrame(toggleSearchContext)
  }

  /**
   * Зона эффектов всяких
   */

  useEffect(() => {
    watchBridge()
    fetchOverview()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSearch()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [searchParams, searchFilters])

  useEffect(() => {
    fetchList()
  }, [listParams, listFilters])

  /**
   * Собираем рефрешеры
   */
  const refreshOverview = () => {
    fetchOverview()
  }

  const refreshSearch = () => {
    fetchSearch()
  }

  const refreshList = () => {
    fetchList()
  }

  /**
   * Собираем подгружатели
   */
  const loadMoreSearch = () => {
    updateSearchFilters({ page: 2 })
  }

  const loadMoreList = () => {
    updateListFilters({ page: 2 })
  }
  
  /**
   * Кнопочки слева
   */
  const filterBadge = (count) => {
    if (count === 0)
      return false

    if (count > 9)
      count = "9+"

    return <Counter size="s" mode="prominent" aria-label="Фильтров: ">{count}</Counter>
  }

  const overviewSuggestButton = (
    <PanelHeaderButton aria-label="Что посмотреть" onClick={() => navigations.go(Stories.Main, Views.Main.Overview, Panels.Main.Overview.Suggest)}><Icon28MagicWandOutline /></PanelHeaderButton>
  )

  const searchFilterButton = () => {
    const count = countNotEmptyFields(searchFilters)
    return <PanelHeaderButton label={filterBadge(count)} aria-label="Фильтр" onClick={() => navigations.openModal(Modals.SearchFilter)}><Icon28SlidersOutline /></PanelHeaderButton>
  }

  const listFilterButton = () => {
    const count = countNotEmptyFields(listFilters)
    return <PanelHeaderButton label={filterBadge(count)} aria-label="Фильтр" onClick={() => navigations.openModal(Modals.ListFilter)}><Icon28SlidersOutline /></PanelHeaderButton>
  }

  const searchHeaderContext = () => {
    const afterBadge = (type) => {
      return searchParams.type === type ? (
        <Icon24Done fill="var(--accent)" />
      ) : null
    }

   return (
      <List>
        <Cell before={<Icon28VideoSquareOutline />} after={afterBadge(TABS_ANIME)}
          onClick={() => changeSearchType(TABS_ANIME)}
        >
          Поиск аниме
        </Cell>
        <Cell before={<Icon28BookOutline />} after={afterBadge(TABS_MANGA)}
          onClick={() => changeSearchType(TABS_MANGA)}
        >
          Поиск манги
        </Cell>
      </List>
    )
  }

  const listHeaderContext = () => {
    const afterBadge = (type) => {
      return listParams.type === type ? (
        <Icon24Done fill="var(--accent)" />
      ) : null
    }

   return (
      <List>
        <Cell before={<Icon28VideoSquareOutline />} after={afterBadge(TABS_ANIME)}
          onClick={() => changeListType(TABS_ANIME)}
        >
          Список аниме
        </Cell>
        <Cell before={<Icon28BookOutline />} after={afterBadge(TABS_MANGA)}
          onClick={() => changeListType(TABS_MANGA)}
        >
          Список манги
        </Cell>
      </List>
    )
  }

  const activeListData = (
    listData[listParams.type + '-' + listParams.list] || {}
  )

  const listTabItem = (tab) => {
    return <TabsItem
      id={tab.key}
      aria-controls={tab.label}
      key={tab.key}
      onClick={() => changeListTab(tab.key)}
      selected={listParams.list === tab.key}
    >{tab.label}</TabsItem>
  }

  const titleListItem = (title) => {
    const _key = 'list-item-' + title.anime_id
    return <TitleListItem key={_key} data={title} onClick={() => openTitle(title)} />
  }

  const titleThumbItem = (title) => {
    const _key = 'thumb-item-' + title.anime_id
    return <TitleThumb key={_key} data={title} onClick={() => openTitle(title)} />
  }

  // Методы что мы передаем во все охуительные истории
  const _methods = {
    go: navigations.go,
    storyBack: navigations.storyBack,
    viewPanelBack: navigations.viewPanelBack,
    openModal: navigations.openModal,
    modalBack: navigations.modalBack,
    openPopout: openPopout,
    openTitle: openTitle
  }

  const modal = (
    <ModalRoot activeModal={navigations.activeModal} onClose={navigations.modalBack}>
      <ModalPageTitleEdit      dynamicContentHeight settlingHeight={100}   id={Modals.TitleEdit}     methods={_methods} data={activeTitle} updateData={updateActiveTitle} />
      <ModalPageSuggestFilter  dynamicContentHeight settlingHeight={false} id={Modals.SuggestFilter} methods={_methods} data={suggestFilters} updateData={updateSuggestFilters} />
      <ModalPageEntriesFilter  dynamicContentHeight settlingHeight={100}   id={Modals.SearchFilter}  methods={_methods} data={searchFilters} updateData={updateSearchFilters} />
      <ModalPageEntriesFilter  dynamicContentHeight settlingHeight={100}   id={Modals.ListFilter}    methods={_methods} data={listFilters} updateData={updateListFilters} />
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
                  { overviewData.map(section =>
                    <Group key={'section-' + section.slug}>
                      <Header subtitle={ section.subtitle }>{ section.title }</Header>
                      { section.items.length === 0 &&
                        <Placeholder>Тут пока-что пусто...</Placeholder>
                      }
                      { section.items.length > 0 && section.type === 'anime' &&
                        <React.Fragment>
                          <CardScroll size="s">
                          { section.items.map(title => titleThumbItem(title)) }
                          </CardScroll>
                        </React.Fragment>
                      }
                      { section.items.length > 0 && section.type === 'genre' &&
                        <React.Fragment>
                          <GenreList size="s">
                          { section.items.map(item =>
                            <GenreThumb key={item.genre_id} data={item} onClick={() => fetchGenre(item)} />
                          ) }
                          </GenreList>
                        </React.Fragment>
                      }
                    </Group>
                  ) }
                  <Spacing size={32} />
                </PullToRefresh>
              </Panel>

              <OverviewSuggestPanel id={Panels.Main.Overview.Suggest} methods={_methods} filters={suggestFilters} />
            </View>
        
            <View id={Views.Main.Search} activePanel={navigations.viewActivePanel(Views.Main.Search)}>
              <Panel id={Panels.Main.Search.Main}>
                <PanelHeader separator={false} before={searchFilterButton()}>
                  <PanelHeaderContent
                    aside={ <Icon16Dropdown style={{ transform: `rotate(${ searchContextOpened ? "180deg" : "0" })`}} /> }
                    onClick={toggleSearchContext}
                  >
                    { searchParams.type === TABS_ANIME ? 'Поиск аниме' : 'Поиск манги' }
                  </PanelHeaderContent>
                </PanelHeader>
                <PanelHeaderContext opened={searchContextOpened} onClose={toggleSearchContext}>
                  { searchHeaderContext() }
                </PanelHeaderContext>
          
                <Search value={searchParams.query} onChange={changeSearchQuery} after={false}/>

                <PullToRefresh onRefresh={refreshSearch} isFetching={fetching.search}>
                  { errors.search &&
                    <Placeholder>{ errors.search }</Placeholder>
                  }
                  { searchParams.query === '' &&
                    <Placeholder>Чтобы начать искать введите в строку поиска название { searchParams.type === TABS_ANIME ? 'аниме' : 'манги' }</Placeholder>
                  }
                  { searchParams.query !== '' && searchData.items.length === 0 &&
                    <Placeholder>По вашему запросу ничего не найдено, возможно, стоит уточнить название</Placeholder>
                  }
                  { searchData.items.length > 0 &&
                    <React.Fragment>
                      <Spacing size={16} />
                      <CardGrid size="l">
                        { searchData.items.map(title => titleListItem(title)) }
                      </CardGrid>
                      { (searchData.items.length < searchData.total) &&
                        <div style={{ padding: 'var(--vkui--size_base_padding_horizontal--regular)'}}>
                          <Button onClick={loadMoreSearch} stretched mode="secondary" size="m">Загрузить еще</Button>
                        </div>
                      }
                      <Footer>{searchData.items.length} из { searchData.total } записей</Footer>
                    </React.Fragment>
                  }
                </PullToRefresh>
              </Panel>
            </View>
        
            <View id={Views.Main.List} activePanel={navigations.viewActivePanel(Views.Main.List)}>
              <Panel id={Panels.Main.List.Main}>
                <PanelHeader separator={false} before={listFilterButton()}>
                  <PanelHeaderContent
                    aside={ <Icon16Dropdown style={{ transform: `rotate(${ listContextOpened ? "180deg" : "0" })`}} /> }
                    onClick={toggleListContext}
                  >
                    { listParams.type === TABS_ANIME ? 'Список аниме' : 'Список манги' }
                  </PanelHeaderContent>
                </PanelHeader>
                <PanelHeaderContext opened={listContextOpened} onClose={toggleListContext}>
                  { listHeaderContext() }
                </PanelHeaderContext>
                <Tabs>
                  <HorizontalScroll>
                    { LIST_TABS[listParams.type].map(tab => listTabItem(tab)) }
                  </HorizontalScroll>
                </Tabs>
                
                <PullToRefresh onRefresh={refreshList} isFetching={fetching.list}>
                  { errors.list &&
                    <Placeholder>{ errors.list }</Placeholder>
                  }
                  { activeListData.total === 0 &&
                    <Placeholder>На данный момент, у вас не добавлено ни { listParams.type === TABS_ANIME ? 'одного аниме' : 'одной манги' } в список!</Placeholder>
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
            
          <TitleStory  id={Stories.Title}  methods={_methods} data={activeTitle}
            activeView={navigations.activeView(Stories.Title)}
          />
        </View>

      </SplitLayout>
    </AppRoot>
  );
}

export default App;