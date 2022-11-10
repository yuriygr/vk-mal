import React, { useContext } from 'react';
import {
  View, Panel, Header, Group, SimpleCell,
  PanelHeader, 
  PanelHeaderBack,
  Link, Avatar, Title, calcInitialsAvatarColor, MiniInfoCell, Card, Button, Placeholder, CellButton, List, Footer
} from '@vkontakte/vkui';
import { Icon20CalendarOutline, Icon20InfoCircleOutline, Icon20Users3Outline, Icon20FollowersOutline, Icon20FolderOutline, Icon24AddOutline, Icon24PenOutline, Icon24ExternalLinkOutline } from '@vkontakte/icons';

import { Stories, Views, TITLE_EDIT_MODAL } from  "../../services/const";
import PreferencesContext from '../../contexts/preferences'

const TitleStory = ({ activeView, data, methods = {} }) => {
  const preferences = useContext(PreferencesContext)

  const cover = "https://cdn.myanimelist.net/r/192x272/images/anime/12/39497.webp?s=0ae299ba10f68551842e8b3108a498f5"

  const name = (lang) => {
    return data.names.english_name
  }

  // На самом деле это пиздец, но переделывать я не хочу. Это надо бэкэнд ковырять,
  // а я не умею там сложно чет эти unmarshal json
  const _companies = data.companies || []
  const _communities = data.communities || []
  const _authors = [
    { id: 154645, letters: 'НК', subtitle: 'Режиссер, Художник', name: 'Никита Изумрудов' },
    { id: 564564, letters: 'ВК', subtitle: 'Художник', name: 'Влада Клименко' },
    { id: 456456, letters: 'ПН', subtitle: 'Режиссер', name: 'Петр Налич' },
  ]
  const _statistic = data.statistic || []
  const _ext_links = data.ext_links || []

  // Самая странная конструкция?
  // Чтобы вы понимали, я не горжусь этой хуитой!
  const companies = () => {
    let arr = {}
    let companies = data.companies || []
    companies.forEach(item =>
      arr[item.role] ? arr[item.role].push(item) : arr[item.role] = [item]
    )
    return arr
  }
  const companies_names = (role) => {
    let arr = {}
    let companies = data.companies || []
    companies.forEach(item =>
      arr[item.role] ? arr[item.role].push(item) : arr[item.role] = [item]
    )
    return (arr[role] || []).map(item => item.names.english_name).join(" · ")
  }
  const genres = () => {
    let arr = {}
    let genres = data.genres || []
    genres.forEach(item =>
      arr[item.category] ? arr[item.category].push(item) : arr[item.category] = [item]
    )
    return arr
  }
  const genres_names = (category) => {
    let arr = {}
    let genres = data.genres || []
    genres.forEach(item =>
      arr[item.category] ? arr[item.category].push(item) : arr[item.category] = [item]
    )
    return (arr[category] || []).map(item => item.names.english_name).join(" · ")
  }


  const openPanel = (view) => {
    methods.go(Stories.Title, view)
  }
  
  const closePanel = () => {
    methods.go(Stories.Title, Views.Title.Main)
  }

  const openEditModal = () => {
    methods.openModal(TITLE_EDIT_MODAL)
  }

  const companiesCell = (item) => {
    const _key = 'company-' + item.role + '-' + item.company_id 
    return (
      <SimpleCell disabled key={_key} before={<Avatar size={36}></Avatar>} subtitle={item.role}>
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
    <View activePanel={activeView}>
      <Panel id={Views.Title.Main}>
        <PanelHeader separator={false}
          before={
            <PanelHeaderBack onClick={methods.storyBack} />
          }
        >Подробнее</PanelHeader>
        <Group>
          <Title level="2" style={{ textAlign: 'center', marginBottom: 12 }}>
            {name()}
          </Title>

          <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', padding: '0 var(--vkui--size_base_padding_horizontal--regular)' }}>
            <div>
              <img style={{ width: '100%', borderRadius: 'var(--vkui--size_card_border_radius--regular, 8px)', boxShadow: 'var(--vkui--elevation3, 0 2px 24px 0 rgba(0, 0, 0, 0.08), 0 0 2px 0 rgba(0, 0, 0, 0.08) )', marginBottom: 10 }} src={cover} alt={name()} />
              <Button stretched before={data.list === '' ? <Icon24AddOutline /> : <Icon24PenOutline />} mode="outline" size="m" onClick={openEditModal}>
                { data.list === '' ? 'Добавить' : 'Изменить' }
              </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 12 }}>
              <div>
                <Card mode="shadow" style={{ padding: 12, marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '2.75rem', color: 'var(--vkui--color_accent_green)', textAlign: 'center' }}>{data.rating.global}</div>
                  <div style={{ textAlign: 'center' }}>Моя оценка <span>{data.rating.my}</span></div>
                </Card>
                {data.series &&
                  <Card mode="shadow">
                    {data.series.viewed} / {data.series.total}
                  </Card>
                }
              </div>
              <div style={{ marginTop: 'auto' }}></div>
            </div>
          </div>
        </Group>

        <Group>
          <MiniInfoCell before={<Icon20FollowersOutline />} textWrap="full">
            Статус: {data.status}
          </MiniInfoCell>
          <MiniInfoCell before={<Icon20InfoCircleOutline />} textWrap="full">
            Тип: {data.type}
          </MiniInfoCell>
          <MiniInfoCell before={<Icon20InfoCircleOutline />} textWrap="full">
            Источник: {data.source}
          </MiniInfoCell>
          <MiniInfoCell before={<Icon20CalendarOutline />} textWrap="full">
            Период выхода: {data.date} - {data.date}
          </MiniInfoCell>

          { (companies_names('studio') !== '' || companies_names('producer') !== '' || companies_names('licensor') !== '') &&
          <MiniInfoCell before={<Icon20Users3Outline />} textWrap="full">
            { companies_names('studio') !== '' &&
              <div>Студия: { companies_names('studio') }</div>
            }
            { companies_names('producer') !== '' &&
              <div>Продюсер: { companies_names('producer') }</div>
            }
            { companies_names('licensor') !== '' &&
              <div>Лицензатор: { companies_names('licensor') }</div>
            }
          </MiniInfoCell>
          }

          { (genres_names('genre') !== '' || genres_names('theme') !== '' || genres_names('demographic') !== '') &&
          <MiniInfoCell before={<Icon20FolderOutline />} textWrap="full">
            { genres_names('genre') !== '' &&
              <div>Жанр: { genres_names('genre') }</div>
            }
            { genres_names('theme') !== '' &&
              <div>Тема: { genres_names('theme') }</div>
            }
            { genres_names('demographic') !== '' &&
              <div>Возрастная категория: { genres_names('demographic') }</div>
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
          { _authors.length === 0 && emptyPlaceholder }
          { _authors.map(author => authorCell(author)) }
        </Group>

        <Group>
          <Header aside={<Link onClick={() => openPanel(Views.Title.Companies)}>Все студии</Link>}>Студии</Header>
          { _companies.length === 0 && emptyPlaceholder }
          { _companies.map(item => companiesCell(item)) }
        </Group>

        <Group>
          <Header aside={<Link onClick={() => openPanel(Views.Title.Communities)}>Все сообщества</Link>}>Сообщества</Header>
          { _communities.length === 0 && emptyPlaceholder }
          { _communities.map(item => communityCell(item)) }
        </Group>

        <Group>
          <Header>Статистика</Header>
          { _statistic.length === 0 && emptyPlaceholder }
        </Group>

        <Group>
          <Header aside={<Link onClick={() => openPanel(Views.Title.Links)}>Все ссылки</Link>}>Внешние ссылки</Header>
          { _ext_links.length === 0 && emptyPlaceholder }
          { _ext_links.map(item => extLinkCell(item)) }
        </Group>

        { preferences.debug &&
          <Group>
            <Header>Отладка</Header>
            <pre>{JSON.stringify(data, null, 2) }</pre>
          </Group>
        }
      </Panel>

      <Panel id={Views.Title.Authors}>
        <PanelHeader separator={false}
          before={
            <PanelHeaderBack onClick={closePanel} />
          }
        >Авторы</PanelHeader>
        { _authors.length === 0 && emptyPlaceholder }
        { _authors.length > 0 &&
          <React.Fragment>
            <Group>
              <List>
              { _authors.map(item => authorCell(item)) }
              </List>
            </Group>
            <Footer>{ _authors.length } авторов</Footer>
          </React.Fragment>
        }
      </Panel>

      <Panel id={Views.Title.Companies}>
        <PanelHeader separator={false}
          before={
            <PanelHeaderBack onClick={closePanel} />
          }
        >Студии</PanelHeader>
        { _companies.length === 0 && emptyPlaceholder }
        { _companies.length > 0 &&
          <React.Fragment>
            { Object.keys(companies()).map(index =>
              <Group key={'companies-' + index}>
                <Header>{ index }</Header>
                <List>
                { companies()[index].map(item => companiesCell(item) ) }
                </List>
              </Group>
            )}
            <Footer>{ _companies.length } студий</Footer>
          </React.Fragment>
        }
      </Panel>

      <Panel id={Views.Title.Communities}>
        <PanelHeader separator={false}
          before={
            <PanelHeaderBack onClick={closePanel} />
          }
        >Сообщества</PanelHeader>
        { _communities.length === 0 && emptyPlaceholder }
        { _communities.length > 0 &&
          <React.Fragment>
            <Group>
              <List>
              { _communities.map(item => communityCell(item) ) }
              </List>
            </Group>
            <Footer>{ _communities.length } сообществ</Footer>
          </React.Fragment>
        }
      </Panel>

      <Panel id={Views.Title.Links}>
        <PanelHeader separator={false}
          before={
            <PanelHeaderBack onClick={closePanel} />
          }
        >Внешние ссылки</PanelHeader>
        { _ext_links.length === 0 && emptyPlaceholder }
        { _ext_links.length > 0 &&
          <React.Fragment>
            <Group>
              <List>
              { _ext_links.map(item => extLinkCell(item)) }
              </List>
            </Group>
            <Footer>{ _ext_links.length } ссылки</Footer>
          </React.Fragment>
        }
      </Panel>
    </View>
  );
}

export default TitleStory;
  