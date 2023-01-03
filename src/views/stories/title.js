import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import {
  View, Panel, Header, Group, SimpleCell,
  PanelHeader, 
  PanelHeaderBack,
  Link, Avatar, Title, calcInitialsAvatarColor, MiniInfoCell, Card, Button, Placeholder, CellButton, List, Footer, ButtonGroup
} from '@vkontakte/vkui';
import { Icon20CalendarOutline, Icon20InfoCircleOutline, Icon20Users3Outline, Icon20FollowersOutline, Icon20FolderOutline, Icon20Add, Icon24ExternalLinkOutline, Icon20TicketOutline, Icon20ShareOutline, Icon20WriteOutline, Icon20BlockOutline, Icon20BugOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge'

import PreferencesContext from '@contexts/preferences'
import { Stories, Views, Modals } from '@services/const'
import formatEntry from '@services/format'

const TitleStory = ({ activeView, history, data, methods = {} }) => {
  const preferences = useContext(PreferencesContext)
  const entry = formatEntry(data)

  const openPanel = (view) => {
    methods.go(Stories.Title, view)
  }
  
  const openEditModal = () => {
    methods.openModal(Modals.TitleEdit)
  }

  const closePanel = (
    <PanelHeaderBack onClick={() => methods.go(Stories.Title, Views.Title.Main)} />
  )


  const shareTitle = () => {
    bridge.send('VKWebAppShare', {
      link: `https://vk.com/app8178307#anime/${entry.anime_id}`
    })
    .then((data) => { 
      console.log(data)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const debugTitle = () => {
    openPanel(Views.Title.Debug)
  }

  const blockTitle = () => {

  }

  const companiesCell = (item) => {
    const _key = 'company-' + item.role + '-' + item.company_id 
    return (
      <SimpleCell disabled key={_key} before={<Avatar size={36} gradientColor={calcInitialsAvatarColor(item.company_id)}></Avatar>} subtitle={item.role}>
        {item.names.english_name}
      </SimpleCell>
    )
  }

  const genreCell = (item) => {
    const _key = 'genre-' + item.category + '-' + item.genre_id
    return (
      <SimpleCell disabled key={_key} before={<Avatar size={36} gradientColor={calcInitialsAvatarColor(item.genre_id)}></Avatar>} subtitle={item.category}>
        {item.names.english_name}
      </SimpleCell>
    )
  }

  const authorCell = (item) => {
    const _key = 'author-' + item.id
    return (
      <SimpleCell disabled key={_key} before={<Avatar size={36} gradientColor={calcInitialsAvatarColor(item.id)}>{item.letters}</Avatar>} subtitle={item.subtitle}>
        {item.name}
      </SimpleCell>
    )
  }

  const communityCell = (item) => {
    const _key = 'community'
    return (
      <CellButton key={_key} before={<Avatar size={36}></Avatar>}>{item}</CellButton>
    )
  }

  const extLinkCell = (item) => {
    return (
      <CellButton key={item.domain} before={<Icon24ExternalLinkOutline />} component="a" target="_blank" href={item.link}>{item.domain}</CellButton>
    )
  }

  const emptyPlaceholder = (
    <Placeholder>
      Тут пока-что пусто...
    </Placeholder>
  )

  return (
    <View activePanel={activeView} history={history}>
      <Panel id={Views.Title.Main}>
        <PanelHeader separator={false} before={
          <PanelHeaderBack onClick={methods.storyBack} />
        }>Подробнее</PanelHeader>
        <Group>
          <Title level="2" style={{ textAlign: 'center', marginBottom: 12 }}>
            {entry.name()}
          </Title>

          <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', padding: '0 var(--vkui--size_base_padding_horizontal--regular)' }}>
            <div>
              <img style={{ width: '100%', borderRadius: 'var(--vkui--size_card_border_radius--regular, 8px)', boxShadow: 'var(--vkui--elevation3, 0 2px 24px 0 rgba(0, 0, 0, 0.08), 0 0 2px 0 rgba(0, 0, 0, 0.08) )', marginBottom: 10 }} src={entry.cover()} alt={entry.name()} />
              <ButtonGroup stretched>
                { !entry.list && 
                  <Button stretched before={<Icon20Add />} mode="primary" size="m" onClick={openEditModal}>Добавить</Button>
                }
                { entry.list && 
                  <Button stretched before={<Icon20WriteOutline />} mode="primary" size="m" onClick={openEditModal}>Изменить</Button>
                }
              </ButtonGroup>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 12 }}>
              <div>
                <Card mode="shadow" style={{ padding: 12, marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '2.75rem', color: 'var(--vkui--color_accent_green)', textAlign: 'center' }}>{entry.rating.global}</div>
                  <div style={{ textAlign: 'center' }}>Моя оценка <span>{entry.rating.my}</span></div>
                </Card>
                { entry.series &&
                  <Card mode="shadow">
                    {entry.series.viewed} / {entry.series.total}
                  </Card>
                }
              </div>
              <div style={{ marginTop: 'auto' }}></div>
              <ButtonGroup stretched>
                <Button stretched mode="secondary" size="m" onClick={shareTitle} before={<Icon20ShareOutline />} />
                { preferences.debug &&
                  <Button stretched mode="secondary" size="m" onClick={debugTitle} before={<Icon20BugOutline />} />
                }
                <Button stretched mode="secondary" size="m" onClick={blockTitle} before={<Icon20BlockOutline />} />
              </ButtonGroup>
            </div>
          </div>
        </Group>

        <Group>
          { entry.airing_status() &&
            <MiniInfoCell before={<Icon20FollowersOutline />} textWrap="full">
              Статус: {entry.airing_status()}
            </MiniInfoCell>
          }
          { entry.premiered() &&
            <MiniInfoCell before={<Icon20TicketOutline />} textWrap="full">
              Премьера: {entry.premiered()}
            </MiniInfoCell>
          }
          <MiniInfoCell before={<Icon20InfoCircleOutline />} textWrap="full">
            Тип: {entry.type}
          </MiniInfoCell>
          <MiniInfoCell before={<Icon20InfoCircleOutline />} textWrap="full">
            Источник: {entry.source}
          </MiniInfoCell>
          { entry.airing_dates() &&
            <MiniInfoCell before={<Icon20CalendarOutline />} textWrap="full">
              Период выхода: {entry.airing_dates()}
            </MiniInfoCell>
          }
          { (entry.flat_companies('studio') !== '' || entry.flat_companies('producer') !== '' || entry.flat_companies('licensor') !== '') &&
          <MiniInfoCell before={<Icon20Users3Outline />} textWrap="full">
            { entry.flat_companies('studio') !== '' &&
              <div>Студия: { entry.flat_companies('studio') }</div>
            }
            { entry.flat_companies('producer') !== '' &&
              <div>Продюсер: { entry.flat_companies('producer') }</div>
            }
            { entry.flat_companies('licensor') !== '' &&
              <div>Лицензатор: { entry.flat_companies('licensor') }</div>
            }
          </MiniInfoCell>
          }

          { (entry.flat_genres('genre') !== '' || entry.flat_genres('theme') !== '' || entry.flat_genres('demographic') !== '') &&
          <MiniInfoCell before={<Icon20FolderOutline />} textWrap="full">
            { entry.flat_genres('genre') !== '' &&
              <div>Жанр: { entry.flat_genres('genre') }</div>
            }
            { entry.flat_genres('theme') !== '' &&
              <div>Тема: { entry.flat_genres('theme') }</div>
            }
            { entry.flat_genres('demographic') !== '' &&
              <div>Возрастная категория: { entry.flat_genres('demographic') }</div>
            }
          </MiniInfoCell>
          }
        </Group>

        <Group>
          <Header aside={<Link>Все персонажи</Link>}>Персонажи</Header>
          { emptyPlaceholder }
        </Group>

        <Group>
          <Header aside={<Link onClick={() => openPanel(Views.Title.Authors)}>Все авторы</Link>}>Авторы</Header>
          { entry.authors.length === 0 && emptyPlaceholder }
          { entry.authors.map(author => authorCell(author)) }
        </Group>

        <Group>
          <Header aside={<Link onClick={() => openPanel(Views.Title.Companies)}>Все студии</Link>}>Студии</Header>
          { entry.companies.length === 0 && emptyPlaceholder }
          { entry.companies.map(item => companiesCell(item)) }
        </Group>

        <Group>
          <Header aside={<Link onClick={() => openPanel(Views.Title.Communities)}>Все сообщества</Link>}>Сообщества</Header>
          { entry.communities.length === 0 && emptyPlaceholder }
          { entry.communities.map(item => communityCell(item)) }
        </Group>

        <Group>
          <Header>Статистика</Header>
          { entry.statistic.length === 0 && emptyPlaceholder }
        </Group>

        <Group>
          <Header aside={<Link onClick={() => openPanel(Views.Title.Links)}>Все ссылки</Link>}>Внешние ссылки</Header>
          { entry.ext_links.length === 0 && emptyPlaceholder }
          { entry.ext_links.map(item => extLinkCell(item)) }
        </Group>
      </Panel>

      <Panel id={Views.Title.Authors}>
        <PanelHeader separator={false} before={closePanel}>Авторы</PanelHeader>
        { entry.authors.length === 0 && emptyPlaceholder }
        { entry.authors.length > 0 &&
          <React.Fragment>
            <Group>
              <List>
              { entry.authors.map(item => authorCell(item)) }
              </List>
            </Group>
            <Footer>{ entry.authors.length } авторов</Footer>
          </React.Fragment>
        }
      </Panel>

      <Panel id={Views.Title.Companies}>
        <PanelHeader separator={false} before={closePanel}>Студии</PanelHeader>
        { entry.companies.length === 0 && emptyPlaceholder }
        { entry.companies.length > 0 &&
          <React.Fragment>
            { Object.keys(entry.grouped_companies()).map(index =>
              <Group key={'companies-' + index}>
                <Header>{ index }</Header>
                <List>
                { entry.grouped_companies()[index].map(item => companiesCell(item) ) }
                </List>
              </Group>
            )}
            <Footer>{ entry.companies.length } студий</Footer>
          </React.Fragment>
        }
      </Panel>

      <Panel id={Views.Title.Genres}>
        <PanelHeader separator={false} before={closePanel}>Жанры</PanelHeader>
        { entry.genres.length === 0 && emptyPlaceholder }
        { entry.genres.length > 0 &&
          <React.Fragment>
            { Object.keys(entry.grouped_genres()).map(index =>
              <Group key={'genres-' + index}>
                <Header>{ index }</Header>
                <List>
                { entry.grouped_genres()[index].map(item => genreCell(item) ) }
                </List>
              </Group>
            )}
            <Footer>{ entry.genres.length } жанров</Footer>
          </React.Fragment>
        }
      </Panel>

      <Panel id={Views.Title.Communities}>
        <PanelHeader separator={false} before={closePanel}>Сообщества</PanelHeader>
        { entry.communities.length === 0 && emptyPlaceholder }
        { entry.communities.length > 0 &&
          <React.Fragment>
            <Group>
              <List>
              { entry.communities.map(item => communityCell(item) ) }
              </List>
            </Group>
            <Footer>{ entry.communities.length } сообществ</Footer>
          </React.Fragment>
        }
      </Panel>

      <Panel id={Views.Title.Links}>
        <PanelHeader separator={false} before={closePanel}>Внешние ссылки</PanelHeader>
        { entry.ext_links.length === 0 && emptyPlaceholder }
        { entry.ext_links.length > 0 &&
          <React.Fragment>
            <Group>
              <List>
              { entry.ext_links.map(item => extLinkCell(item)) }
              </List>
            </Group>
            <Footer>{ entry.ext_links.length } ссылки</Footer>
          </React.Fragment>
        }
      </Panel>

      <Panel id={Views.Title.Debug}>
        <PanelHeader separator={false} before={closePanel}>Отладка</PanelHeader>
        <pre>{JSON.stringify(data, null, 2) }</pre>
      </Panel>
    </View>
  );
}

TitleStory.propTypes = {
  activeView: PropTypes.string,
  data:       PropTypes.object,
  methods:    PropTypes.object
}

export default TitleStory;
  