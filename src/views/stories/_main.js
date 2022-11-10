import React from 'react';
import { Panel, PanelHeader, Placeholder } from '@vkontakte/vkui';
import { Stories, Views, Panels } from '../services/const'
import { Icon28BugOutline, Icon28GridLayoutOutline, Icon28HorseToyOutline, Icon28ListOutline, Icon28SearchStarsOutline } from '@vkontakte/icons';

const MainStory = ({ go, goBack, openPopout, openModal }) => {

  const mainTabbar = (
    <Tabbar>
      <TabbarItem
        onClick={() => this.go(Stories.Main, Views.Main.Overview, Panels.Overview.Main)}
        selected={this.state.activeViews[Stories.Main] === Views.Main.Overview}
        text="Обзор"
      ><Icon28GridLayoutOutline /></TabbarItem>
      <TabbarItem
        onClick={() => this.go(Stories.Main, Views.Main.Search, Panels.Search.Main)}
        selected={this.state.activeViews[Stories.Main] === Views.Main.Search}
        text="Поиск"
      ><Icon28SearchStarsOutline /></TabbarItem>
      <TabbarItem
        onClick={() => this.go(Stories.Main, Views.Main.List, Panels.List.Main)}
        selected={this.state.activeViews[Stories.Main] === Views.Main.List}
        text="Список"
      ><Icon28ListOutline /></TabbarItem>
    </Tabbar>
  )

  const feedback_button = (
    <PanelHeaderButton key={Stories.Feedback} aria-label="Отзыв" onClick={() => go(Stories.Feedback)}>
      <Icon28BugOutline />
    </PanelHeaderButton>
  )

  const tests_button = (
    <PanelHeaderButton key={Stories.Tests} aria-label="Проверочная" onClick={() => go(Stories.Tests)}>
      <Icon28HorseToyOutline />
    </PanelHeaderButton>
  )

  return (
    <Panel>
      <Epic activeStory={this.state.activeViews[Stories.Main]} tabbar={mainTabbar}>
        <View id={Views.Main.Overview} activePanel={this.state.activePanels[Views.Main.Overview]}>
          <Panel id={Panels.Overview.Main}>
            <PanelHeader before={[ feedback_button, tests_button ]} separator={false}>Обзор</PanelHeader>                          
            <PullToRefresh
              onRefresh={() => this.refreshOverview}
              isFetching={this.state.fetching}
            >
              <Group mode="plain" separator="hide">
                <pre>{JSON.stringify(this.state.user, null, 2) }</pre>
              </Group>
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

        <View id={Views.Main.Search} activePanel={this.state.activePanels[Views.Main.Search]}>
          <Panel id={Panels.Search.Main}>
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

        <View id={Views.Main.List} activePanel={this.state.activePanels[Views.Main.List]}>
          <Panel id={Panels.List.Main}>
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
                  onClick={() => changeListTab(tab.key)}
                  selected={this.state.activeListTab === tab.key}
                >{tab.label}</TabsItem>
              ) }
                <TabsItem
                  aria-controls='Секрет'
                  onClick={() => go(Stories.Secret)}
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
  )
}

export default MainStory;
  