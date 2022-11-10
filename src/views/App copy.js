import React, { Component } from 'react';
import {
  AppRoot, ModalRoot, Epic, SplitLayout, Placeholder,
  Tabbar, TabbarItem,
  View, Panel, List, Cell, Header, Group, Spacing, CardGrid, CardScroll, ScreenSpinner, Tabs, TabsItem, HorizontalScroll,
  
  PanelHeader, PanelHeaderContent,PanelHeaderButton, PanelHeaderContext,
  PullToRefresh, Footer, Link, Search,

  AdaptivityProvider, ConfigProvider,
} from '@vkontakte/vkui';
import {
  Icon16Dropdown, Icon24Done,
  Icon28SearchStarsOutline, Icon28GridLayoutOutline, Icon28ListOutline, Icon28BugOutline, Icon28HorseToyOutline, Icon24LikeOutline, Icon28VideoSquareOutline, Icon28BookOutline
} from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

// Мои штуки
import { TitleThumb, TitleListItem } from '../components/titles';
import { TitleStory, FeedbackStory, SecretStory, TestsStory } from '../views/stories';
import { ModalPageTitleEdit } from '../views/modals';
import { MAIN_STORY, TITLE_STORY, SECRET_STORY, FEEDBACK_STORY, OVERVIEW_VIEW, SEARCH_VIEW, LIST_VIEW, MAIN_PANEL, TITLE_EDIT_MODAL, TESTS_STORY, LIST_TABS, TABS_ANIME, TABS_MANGA } from "../services/const";
import { myOverview, myList, mySearch } from '../services/api';
import UserContext, { UserProvider } from '../contexts/user_context';

import "@vkontakte/vkui/dist/vkui.css";

class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      user: false,

      appearance: 'light',
      lang: 'RU',
      fetching: false,
      error: false,

      popout: null,

      // История навигации
      storyHistory: [
        MAIN_STORY
      ],
      modalHistory: [],

      // История -- главная штука. Внутри нее происходят уже смены View и Panels внутри View
      activeStory: MAIN_STORY,
      activeViews: {
        [MAIN_STORY]: OVERVIEW_VIEW
      },
      activePanels: {
        [OVERVIEW_VIEW]: MAIN_PANEL,
        [SEARCH_VIEW]: MAIN_PANEL,
        [LIST_VIEW]: MAIN_PANEL,
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
      listData: [],
    };

    this.modalBack = () => {
      this.modal(this.state.modalHistory[this.state.modalHistory.length - 2]);
    };

    this.storyBack = () => {
      this.go(this.state.storyHistory[this.state.storyHistory.length - 2]);
    }

    this.toggleListContext = this.toggleListContext.bind(this);
    this.changeSearchQuery = this.changeSearchQuery.bind(this);
    this.changeListTab = this.changeListTab.bind(this);
    this.changeListType = this.changeListType.bind(this);

    this.go = this.go.bind(this);
    this.modal = this.modal.bind(this);
    this.popout = this.popout.bind(this);
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
  modal(activeModal = null) {
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
  popout(popout = null) {
    this.setState({ popout: popout })
  }


  // Смотрим за событиями моста
  watchBridge() {
    bridge.subscribe((e) => {
      switch (e.detail.type) {
        case 'VKWebAppUpdateConfig':
          this.setState({ appearance: e.detail.data.appearance })
          break;
      
        default:
          break;
      }
    })
  }

  // Открытие панели с тайтлом
  fetchTitle(title) {
    this.setState({ fetching: true, activeTitle: title })
    myOverview.title(title.id)
    .then(title => {
      this.setState({
        activeTitle: title,
        fetching: false,
        popout: null
      })
      this.go(TITLE_STORY)
    })
    .catch(error => {
      this.setState({
        fetching: false,
        popout: null,
        error
      })
    })
  }

  // Загрузка главной страницы
  fetchOverview() {
    this.setState({ fetching: true, popout: <ScreenSpinner /> });
    myOverview.get()
    .then(data => {
      this.setState({
        overviewData: data,
        fetching: false,
        popout: null
      })
    })
    .catch(error => {
      this.setState({
        fetching: false,
        popout: null,
        error
      })
    })
  }

  changeSearchQuery(e) {
    this.setState({ searchQuery: e.target.value })
    mySearch.get({ query: e.target.value })
    .then(data => {
      this.setState({
        searchData: data,
        fetching: false,
        popout: null
      })
    })
    .catch(error => {
      this.setState({
        fetching: false,
        popout: null,
        error
      })
    })
  }

  toggleListContext() {
    this.setState({ listContextOpened: !this.state.listContextOpened })
  }
  changeListTab(key) {
    this.setState({ activeListTab: key })
    this.fetchList()
  }
  changeListType(key) {
    this.setState({ activeListType: key, activeListTabs: this.state.listTabs[key], activeListTab: 'all'})
    this.fetchList()
    requestAnimationFrame(this.toggleListContext)
  }

  fetchList() {
    this.setState({ fetching: true, popout: <ScreenSpinner /> });
    myList.get({
      tab: this.state.activeListTab,
      type: this.state.activeListType,
      page: 1
    })
    .then(data => {
      this.setState({
        listData: data,
        fetching: false,
        popout: null
      })
    })
    .catch(error => {
      this.setState({
        fetching: false,
        popout: null,
        error
      })
    })
  }

  refreshOverview() {
    this.fetchOverview()
  }

  refreshList() {
    this.fetchList()
  }

  componentDidMount() {
    this.watchBridge()
    this.fetchOverview()
    this.fetchList()
  }

  render() {
    const tabbar = (
      <Tabbar>
        <TabbarItem
          onClick={() => this.go(MAIN_STORY, OVERVIEW_VIEW, MAIN_PANEL)}
          selected={this.state.activeViews[MAIN_STORY] === OVERVIEW_VIEW}
          text="Обзор"
        ><Icon28GridLayoutOutline /></TabbarItem>
        <TabbarItem
          onClick={() => this.go(MAIN_STORY, SEARCH_VIEW, MAIN_PANEL)}
          selected={this.state.activeViews[MAIN_STORY] === SEARCH_VIEW}
          text="Поиск"
        ><Icon28SearchStarsOutline /></TabbarItem>
        <TabbarItem
          onClick={() => this.go(MAIN_STORY, LIST_VIEW, MAIN_PANEL)}
          selected={this.state.activeViews[MAIN_STORY] === LIST_VIEW}
          text="Список"
        ><Icon28ListOutline /></TabbarItem>
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

    const feedback_button = (
      <PanelHeaderButton key={FEEDBACK_STORY} aria-label="Отзыв" onClick={() => this.go(FEEDBACK_STORY)}>
        <Icon28BugOutline />
      </PanelHeaderButton>
    )

    const tests_button = (
      <PanelHeaderButton key={TESTS_STORY} aria-label="Проверочная" onClick={() => this.go(TESTS_STORY)}>
        <Icon28HorseToyOutline />
      </PanelHeaderButton>
    )


    return (
      <UserProvider>
        <ConfigProvider appearance={this.state.appearance}>
          <AdaptivityProvider>
            <AppRoot>
              <SplitLayout modal={modal} popout={this.state.popout}>

                <View activePanel={this.state.activeStory}>
                  <Panel id={MAIN_STORY}>
                    <Epic activeStory={this.state.activeViews[MAIN_STORY]} tabbar={tabbar}>
                      <View id={OVERVIEW_VIEW} activePanel={this.state.activePanels[OVERVIEW_VIEW]}>
                        <Panel id={MAIN_PANEL}>
                          <PanelHeader before={[ feedback_button, tests_button ]} separator={false}>Обзор</PanelHeader>
                          <pre>{JSON.stringify(this.state.user, null, 2) }</pre>

                          <PullToRefresh
                            onRefresh={() => this.refreshOverview}
                            isFetching={this.state.fetching}
                          >
                            { this.state.overviewData.map(section =>
                              <Group mode="plain" separator="hide" key={'section-' + section.slug} header={
                                <Header aside={<Link>Еще</Link>} subtitle={ section.subtitle }>{ section.title }</Header>
                              }>
                                <CardScroll size="s">
                                { section.titles.map(title =>
                                  <TitleThumb key={title.id} data={title} onClick={() => this.fetchTitle(title)} />
                                ) }
                                </CardScroll>
                              </Group>
                            ) }
                          </PullToRefresh>
                        </Panel>
                      </View>
                
                      <View id={SEARCH_VIEW} activePanel={this.state.activePanels[SEARCH_VIEW]}>
                        <Panel id={MAIN_PANEL}>
                          <PanelHeader before={feedback_button} separator={false}>Поиск</PanelHeader>
                          <Search
                            value={this.state.searchQuery}
                            onChange={this.changeSearchQuery}
                            after={null}
                          />
                          { this.state.searchQuery === '' &&
                            <Placeholder>
                              Чтобы начать искать введите в строку поиска название аниме/манги
                            </Placeholder>
                          }
                          { this.state.searchQuery !== '' && this.state.searchData.length === 0 &&
                            <Placeholder>
                              По вашему запросу ничего не найдено, возможно, стоит уточнить название
                            </Placeholder>
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
                
                      <View id={LIST_VIEW} activePanel={this.state.activePanels[LIST_VIEW]}>
                        <Panel id={MAIN_PANEL}>
                          <PanelHeader before={feedback_button} separator={false}>
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
                                onClick={() => this.go(SECRET_STORY)}
                                selected={this.state.activeListTab === 'secret'}
                              ><Icon24LikeOutline style={{ color: 'var(--vkui--color_icon_negative)' }} /></TabsItem>
                            </HorizontalScroll>
                          </Tabs>

                          <PullToRefresh
                            onRefresh={() => this.refreshList}
                            isFetching={this.state.fetching}
                          >
                            { this.state.listData.length === 0 &&
                              <Placeholder>
                                На данный момент, у вас не добавлено ни { this.state.activeListType === TABS_ANIME ? 'одного аниме' : 'одной манги' } в список!
                              </Placeholder>
                            }
                            { this.state.listData.length > 0 &&
                              <React.Fragment>
                                <Spacing size={16} />
                                <CardGrid size="l">
                                { this.state.listData.map(title =>
                                  <TitleListItem key={ 'list-item-' + title.id} data={title} onClick={() => this.fetchTitle(title)} />
                                ) }
                                </CardGrid>
                                <Footer>{ this.state.listData.length } записи</Footer>
                              </React.Fragment>
                            }
                          </PullToRefresh>
                        </Panel>
                      </View>
                    </Epic>
                  </Panel>
                  
                  <FeedbackStory id={FEEDBACK_STORY} goBack={this.storyBack} openPopout={this.popout} />
                  <SecretStory   id={SECRET_STORY}   goBack={this.storyBack} />
                  <TestsStory    id={TESTS_STORY}    goBack={this.storyBack} />
                  <TitleStory    id={TITLE_STORY}    goBack={this.storyBack} openModal={this.modal} data={this.state.activeTitle} />
                </View>

              </SplitLayout>
            </AppRoot>
          </AdaptivityProvider>
        </ConfigProvider>
      </UserProvider>
    );
  }
}

export default App;