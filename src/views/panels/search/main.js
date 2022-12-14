import React, { useState } from 'react';
import { CardGrid, Footer, Panel, PanelHeader, PanelHeaderButton, Placeholder, Search, Spacing } from '@vkontakte/vkui'
import { Icon28SlidersOutline } from '@vkontakte/icons'

import { TitleListItem } from '@components/titles'
import { Modals } from  "@services/const"
import Api from '@services/api'

const SearchMainPanel = ({ query, setQuery, methods }) => {
  const [ fetching, setFetching ] = useState(false)
  const [ error, setError ] = useState(false)

  const [ searchData, setSearchData ] = useState([])
  
  const changeSearchQuery = (e) => {
    setFetching(false)
    setQuery(e.target.value)
  
    Api.catalog.search({ query: e.target.value })
    .then(data => 
      setSearchData(data)
    )
    .catch(error => setError(error))
    .then(_ => setFetching(false))
  }

  
  const titleListItem = (title) => {
    const _key = 'list-item-' + title.anime_id
    return <TitleListItem key={_key} data={title} onClick={() => methods.fetchTitle(title)} />
  }

  const filterButton = (
    <PanelHeaderButton aria-label="Фильтр" onClick={() => methods.openModal(Modals.SearchFilter)}><Icon28SlidersOutline /></PanelHeaderButton>
  )

  return (
    <Panel>
      <PanelHeader separator={false} before={filterButton}>Поиск</PanelHeader>
      <Search value={query} onChange={changeSearchQuery} after={false}/>
      { query === '' &&
        <Placeholder>Чтобы начать искать введите в строку поиска название аниме/манги</Placeholder>
      }
      { query !== '' && searchData.length === 0 &&
        <Placeholder>По вашему запросу ничего не найдено, возможно, стоит уточнить название</Placeholder>
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
  )
}

export default SearchMainPanel;
  