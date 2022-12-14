import React from 'react';
import { ContentCard } from '@vkontakte/vkui';

import formatEntry from  '@services/format'

const TitleThumb = ({ data, onClick }) => {
  const entry = formatEntry(data)

  const subtitle = () => {
    let _r = []

    if (entry.type) {
      _r.push(entry.type)
    }

    if (entry.premiered()) {
      _r.push(entry.premiered())
    }

    return _r.join(", ")
  }

  const caption = () => {
    let _r = []

    _r.push(`${entry.airing_status()}`)
    _r.push(`${data.series.total} серий`)

    return _r.join(", ")
  }

  return (
    <ContentCard
      src={entry.cover()}
      text={entry.name()}
      subtitle={subtitle()}
      caption={caption()}
      onClick={onClick}
      style={{ marginBottom: 16 }}
    />
  )
}

export default TitleThumb
  