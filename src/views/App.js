import React, { Component } from 'react';
import {
  AppRoot, ModalRoot, Epic, SplitLayout, Placeholder,
  Tabbar, TabbarItem,
  View, Panel, List, Cell, Header, Group, Spacing, CardGrid, CardScroll, ScreenSpinner, Tabs, TabsItem, HorizontalScroll,
  
  PanelHeader, PanelHeaderContent, PanelHeaderContext,
  PullToRefresh, Footer, Link, Search,

  AdaptivityProvider, ConfigProvider, SimpleCell, Switch,
} from '@vkontakte/vkui';
import {
  Icon16Dropdown, Icon24Done,
  Icon28SearchStarsOutline,
  Icon28GridLayoutOutline,
  Icon28HorseToyOutline, Icon24LikeOutline, Icon28VideoSquareOutline, Icon28BookOutline, Icon28ListBulletSquareOutline, Icon28MoreHorizontal, Icon28QuestionOutline, Icon28MoneyCircleOutline, Icon28HieroglyphCharacterOutline, Icon28BracketsSlashSquareOutline, Icon28BugOutline
} from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

// Мои штуки
import { GenreThumb } from '../components/genres';
import { TitleThumb, TitleListItem } from '../components/titles';
import { TitleStory, SecretStory } from '../views/stories';
import { FeedbackPanel, TestsPanel, DonatePanel } from '../views/panels';
import { ModalPageTitleEdit } from '../views/modals';
import { Stories, Views, Panels, TITLE_EDIT_MODAL, LIST_TABS, TABS_ANIME, TABS_MANGA } from "../services/const";
import Api, { mySearch } from '../services/api';

import "@vkontakte/vkui/dist/vkui.css";

class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      appearance: 'light',
      lang: 'RU',
      fetching: false,
      error: false,

      popout: null,

      // История навигации
      storyHistory: [
        Stories.Main
      ],
      modalHistory: [],

      // История -- главная штука. Внутри нее происходят уже смены View и Panels внутри View
      activeStory: Stories.Main,
      // Экраны -- штуки внутри историй.
      activeViews: {
        [Stories.Main]: Views.Main.Overview,
        [Stories.Title]: Views.Title.Main
      },
      // Панели -- пиздец я запутался
      activePanels: {
        [Views.Main.Overview]: Panels.Main.Overview.Main,
        [Views.Main.Search]: Panels.Main.Search.Main,
        [Views.Main.List]: Panels.Main.List.Main,
        [Views.Main.Etc]: Panels.Main.Etc.Main,
      },
    
      // Вкладка тайтла
      activeTitle: {},

      // Вкладка обзора
      overviewData: [],

      // Вкладка поиска
      searchQuery: '',
      searchData: [],

      // Вкладка списка
      activeListType: TABS_ANIME,
      activeListTab: 'all',
      activeListTabs: LIST_TABS[TABS_ANIME],
      
      listContextOpened: false,
      listTabs: LIST_TABS,
      listData: {},
    };

    this.modalBack = () => {
      this.openModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
    };

    this.storyBack = () => {
      this.go(this.state.storyHistory[this.state.storyHistory.length - 2]);
    }

    this.toggleListContext = this.toggleListContext.bind(this);
    this.changeSearchQuery = this.changeSearchQuery.bind(this);
    this.changeListTab = this.changeListTab.bind(this);
    this.changeListType = this.changeListType.bind(this);

    this.go = this.go.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openPopout = this.openPopout.bind(this);
  }

  /**
   * Переход между экртанами и панелями
   * @param {string} activeStory Активный экран истррии
   * @param {string} activeView Активный вид активного экрана
   * @param {string} panel  Активная панель активного вида активного экрана
   */
  go(activeStory, activeView = this.state.activeViews[activeStory], panel = this.state.activePanels[activeView]) {
    let storyHistory = this.state.storyHistory ? [...this.state.storyHistory] : [];

    if (activeStory === null) {
      storyHistory = [];
    } else if (storyHistory.indexOf(activeStory) !== -1) {
      storyHistory = storyHistory.splice(0, storyHistory.indexOf(activeStory) + 1);
    } else {
      storyHistory.push(activeStory);
    }

    this.setState({
      storyHistory,
      activeStory,
      activeViews: {
        ...this.state.activeViews,
        [activeStory]: activeView
      },
      activePanels: {
        ...this.state.activePanels,
        [activeView]: panel,
      },
    });
  }

  /**
   * Открытие модального окна
   * @param {string} activeModal Активное модальное окно
   */
  openModal(activeModal = null) {
    let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];
  
    if (activeModal === null) {
      modalHistory = [];
    } else if (modalHistory.indexOf(activeModal) !== -1) {
      modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
    } else {
      modalHistory.push(activeModal);
    }

    this.setState({
      modalHistory,
      activeModal
    });
  }

  /**
   * Открытие пупышек
   * @param {string} popout Активная пупышка
   */
  openPopout(popout = null) {
    this.setState({ popout: popout })
  }


  async fetchUser() {
    const user = await bridge.send('VKWebAppGetUserInfo')
    this.setState({ user })
  }

  // Смотрим за событиями моста
  watchBridge() {
    bridge.subscribe((e) => {
      switch (e.detail.type) {
        case 'VKWebAppUpdateConfig':
          this.setState({ appearance: e.detail.data.appearance })
          break;

        case 'VKWebAppGetAuthTokenResult':
          this.setState({ token: e.detail.token })
          break;
      
        default:
          break;
      }
    })
  }

  // Открытие панели с тайтлом
  fetchTitle(title) {
    this.setState({ fetching: true, activeTitle: title })
    //myOverview.title(title.id)
    //.then(title => {
    //  this.setState({ activeTitle: title, fetching: false, popout: null })
      this.go(Stories.Title, Views.Title.Main)
    //})
    //.catch(error => this.setState({ fetching: false, popout: null, error }))
  }

  // Открытие панели с жанром
  fetchGenre(genre) {
    this.setState({ searchQuery: genre.names.english_name })
    this.go(Stories.Main, Views.Main.Search)
  }

  // Загрузка главной страницы
  fetchOverview() {
    this.setState({ fetching: true, popout: <ScreenSpinner /> });
    Api.my.overview()
    .then(data => {
      this.setState({ overviewData: data.sections, fetching: false, popout: null })
    })
    .catch(error => this.setState({ fetching: false, popout: null, error }))
  }

  changeSearchQuery(e) {
    this.setState({ searchQuery: e.target.value })
    mySearch.get({ query: e.target.value })
    .then(data => {
      this.setState({ searchData: data, fetching: false, popout: null })
    })
    .catch(error => this.setState({ fetching: false, popout: null, error }))
  }

  // Загрузка списка
  fetchList() {
    this.setState({ fetching: true, popout: <ScreenSpinner /> });
    Api.my.list(this.state.activeListType, {
      list: this.state.activeListTab,
      page: 1
    })
    .then(data => {
      this.setState(prevState => {
        let listData = Object.assign({}, prevState.listData)
        listData[this.state.activeListType + '-' + this.state.activeListTab] = data
        return { listData, fetching: false, popout: null }
      })
    })
    .catch(error => this.setState({ fetching: false, popout: null, error }))
  }

  toggleListContext() {
    this.setState({ listContextOpened: !this.state.listContextOpened })
  }
  async changeListTab(key) {
    await this.setState({ activeListTab: key })
    this.fetchList()
  }
  async changeListType(key) {
    await this.setState({ activeListType: key, activeListTabs: this.state.listTabs[key], activeListTab: 'all'})
    this.fetchList()
    requestAnimationFrame(this.toggleListContext)
  }

  async refreshOverview() {
    await this.fetchOverview()
  }

  async refreshList() {
    await this.fetchList()
  }

  componentDidMount() {
    this.watchBridge()
    this.fetchUser()
    this.fetchOverview()
    this.fetchList()
  }

  render() {
    const mainTabbar = (
      <Tabbar>
        <TabbarItem
          onClick={() => this.go(Stories.Main, Views.Main.Overview, Panels.Main.Overview.Main)}
          selected={this.state.activeViews[Stories.Main] === Views.Main.Overview}
          text="Обзор"
        ><Icon28GridLayoutOutline /></TabbarItem>
        <TabbarItem
          onClick={() => this.go(Stories.Main, Views.Main.Search, Panels.Main.Search.Main)}
          selected={this.state.activeViews[Stories.Main] === Views.Main.Search}
          text="Поиск"
        ><Icon28SearchStarsOutline /></TabbarItem>
        <TabbarItem
          onClick={() => this.go(Stories.Main, Views.Main.List, Panels.Main.List.Main)}
          selected={this.state.activeViews[Stories.Main] === Views.Main.List}
          text="Список"
        ><Icon28ListBulletSquareOutline /></TabbarItem>
        <TabbarItem
          onClick={() => this.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Main)}
          selected={this.state.activeViews[Stories.Main] === Views.Main.Etc}
          text="Еще"
        ><Icon28MoreHorizontal /></TabbarItem>
      </Tabbar>
    )

    const modal = (
      <ModalRoot activeModal={this.state.activeModal} onClose={this.modalBack}>
        <ModalPageTitleEdit dynamicContentHeight settlingHeight={100} id={TITLE_EDIT_MODAL} goBack={this.modalBack} data={this.state.activeTitle} />
      </ModalRoot>
    )

    const listHeaderContext = (
      <List>
        <Cell
          before={<Icon28VideoSquareOutline />}
          after={
            this.state.activeListType === TABS_ANIME ? (
              <Icon24Done fill="var(--accent)" />
            ) : null
          }
          onClick={() => this.changeListType(TABS_ANIME)}
        >
          Список аниме
        </Cell>
        <Cell
          before={<Icon28BookOutline />}
          after={
            this.state.activeListType === TABS_MANGA ? (
              <Icon24Done fill="var(--accent)" />
            ) : null
          }
          onClick={() => this.changeListType(TABS_MANGA)}
        >
          Список манги
        </Cell>
      </List>
    )

    const activeListData = () => {
      return this.state.listData[this.state.activeListType + '-' + this.state.activeListTab] || []
    }

    // Методы что мы передаем во все охуительные истории
    const _methods = {
      go: this.go,
      storyBack: this.storyBack,
      openModal: this.openModal,
      openPopout: this.openPopout
    }

    const emptyPlaceholder = (message) => {
      return <Placeholder>{message}</Placeholder>
    }

    return (
      <ConfigProvider appearance={this.state.appearance}>
        <AdaptivityProvider>
          <AppRoot>
            <SplitLayout modal={modal} popout={this.state.popout}>

              <View activePanel={this.state.activeStory}>
                <Epic id={Stories.Main} activeStory={this.state.activeViews[Stories.Main]} tabbar={mainTabbar}>
                  <View id={Views.Main.Overview} activePanel={this.state.activePanels[Views.Main.Overview]}>
                    <Panel id={Panels.Main.Overview.Main}>
                      <PanelHeader separator={false}>Обзор</PanelHeader>                          
                      <PullToRefresh
                        onRefresh={() => this.refreshOverview}
                        isFetching={this.state.fetching}
                      >
                        { this.state.overviewData.map(section =>
                          <Group key={'section-' + section.slug} header={
                            <Header subtitle={ section.subtitle } aside={<Link>Смотреть все</Link>}>{ section.title }</Header>
                          }>
                          { section.items.length === 0 &&
                            emptyPlaceholder("Тут пока-что пусто...")
                          }
                          { section.items.length > 0 && section.type === 'anime' &&
                            <React.Fragment>
                              <CardScroll size="s">
                              { section.items.map(title =>
                                <TitleThumb key={title.id} data={title} onClick={() => this.fetchTitle(title)} />
                              ) }
                              </CardScroll>
                            </React.Fragment>
                          }
                          { section.items.length > 0 && section.type === 'genre' &&
                            <React.Fragment>
                              <CardScroll size="s">
                              { section.items.map(item =>
                                <GenreThumb key={item.genre_id} data={item} onClick={() => this.fetchGenre(item)} />
                              ) }
                              </CardScroll>
                            </React.Fragment>
                          }
                          </Group>
                        ) }
                      </PullToRefresh>
                    </Panel>
                  </View>
            
                  <View id={Views.Main.Search} activePanel={this.state.activePanels[Views.Main.Search]}>
                    <Panel id={Panels.Main.Search.Main}>
                      <PanelHeader separator={false}>Поиск</PanelHeader>
                      <Search
                        value={this.state.searchQuery}
                        onChange={this.changeSearchQuery}
                        after={null}
                      />
                      { this.state.searchQuery === '' &&
                        emptyPlaceholder("Чтобы начать искать введите в строку поиска название аниме/манги")
                      }
                      { this.state.searchQuery !== '' && this.state.searchData.length === 0 &&
                        emptyPlaceholder("По вашему запросу ничего не найдено, возможно, стоит уточнить название")
                      }
                      { this.state.searchData.length > 0 &&
                          <React.Fragment>
                            <Spacing size={12} />
                            <CardGrid size="l">
                            { this.state.searchData.map(title =>
                              <TitleListItem key={ 'search-item-' + title.id} data={title} onClick={() => this.fetchTitle(title)} />
                            ) }
                            </CardGrid>
                            <Footer>{ this.state.searchData.length } записи</Footer>
                          </React.Fragment>
                        }
                    </Panel>
                  </View>
            
                  <View id={Views.Main.List} activePanel={this.state.activePanels[Views.Main.List]}>
                    <Panel id={Panels.Main.List.Main}>
                      <PanelHeader separator={false}>
                        <PanelHeaderContent
                          aside={
                            <Icon16Dropdown style={{ transform: `rotate(${ this.state.listContextOpened ? "180deg" : "0" })`}} />
                          }
                          onClick={this.toggleListContext}
                        >
                          { this.state.activeListType === TABS_ANIME ? 'Список аниме' : 'Список манги' }
                        </PanelHeaderContent>
                      </PanelHeader>
                      <PanelHeaderContext
                        opened={this.state.listContextOpened}
                        onClose={this.toggleListContext}
                      >
                        { listHeaderContext }
                      </PanelHeaderContext>
                      <Tabs>
                        <HorizontalScroll>
                        { this.state.activeListTabs.map(tab =>
                          <TabsItem
                            aria-controls={tab.label}
                            key={tab.key}
                            onClick={() => this.changeListTab(tab.key)}
                            selected={this.state.activeListTab === tab.key}
                          >{tab.label}</TabsItem>
                        ) }
                          <TabsItem
                            aria-controls='Секрет'
                            onClick={() => this.go(Stories.Secret)}
                            selected={this.state.activeListTab === 'secret'}
                          ><Icon24LikeOutline style={{ color: 'var(--vkui--color_icon_negative)' }} /></TabsItem>
                        </HorizontalScroll>
                      </Tabs>
                      
                      <PullToRefresh
                        onRefresh={() => this.refreshList}
                        isFetching={this.state.fetching}
                      >
                        { activeListData().length === 0 &&
                          <Placeholder>
                            На данный момент, у вас не добавлено ни { this.state.activeListType === TABS_ANIME ? 'одного аниме' : 'одной манги' } в список!
                          </Placeholder>
                        }
                        { activeListData().length > 0 &&
                          <React.Fragment>
                            <Spacing size={16} />
                            <CardGrid size="l">
                            { activeListData().map(title =>
                              <TitleListItem key={ 'list-item-' + title.anime_id} data={title} onClick={() => this.fetchTitle(title)} />
                            ) }
                            </CardGrid>
                            <Footer>{ activeListData().length } записи</Footer>
                          </React.Fragment>
                        }
                      </PullToRefresh>
                    </Panel>
                  </View>

                  <View id={Views.Main.Etc} activePanel={this.state.activePanels[Views.Main.Etc]}>
                    <Panel id={Panels.Main.Etc.Main}>
                      <PanelHeader separator={false}>Еще</PanelHeader>
                      <Group>
                        <Header>Настройки</Header>
                        <SimpleCell expandable before={<Icon28HieroglyphCharacterOutline />} indicator="Русский">Названия</SimpleCell>
                        <SimpleCell Component="label" before={<Icon28BugOutline />} after={<Switch defaultChecked />}>Режим отладки</SimpleCell>
                      </Group>
                      <Group>
                        <List>
                          <Cell expandable before={<Icon28QuestionOutline />} onClick={() => this.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Feedback)}>
                            Обратная связь
                          </Cell>
                          <Cell expandable before={<Icon28MoneyCircleOutline />} onClick={() => this.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Donate)}>
                            Поддержать
                          </Cell>
                          <Cell expandable before={<Icon28HorseToyOutline />} onClick={() => this.go(Stories.Main, Views.Main.Etc, Panels.Main.Etc.Tests)}>
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
                  activeView={this.state.activeViews[Stories.Title]}
                  data={this.state.activeTitle}
                />
              </View>

            </SplitLayout>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    );
  }
}

export default App;