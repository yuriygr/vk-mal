import React from 'react';
import { Title, Subhead, Card, Progress, Paragraph } from '@vkontakte/vkui'
import { Icon12Favorite } from '@vkontakte/icons'

import formatEntry from  '@services/format'

const TitleListItem = ({ data, onClick } ) => {
  const entry = formatEntry(data)

  const cardStyle = {  
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: '0.75rem'
  }

  const coverStyle = {
    flexShrink: 0,
    width: '70px',
    borderRadius: 'var(--vkui--size_card_border_radius--regular, 8px)'
  }

    
  const subhead = () => {
    let _r = []

    if (entry.type) {
      _r.push(entry.type)
    }

    if (entry.premiered()) {
      _r.push(entry.premiered())
    }

    return _r.join(", ")
  }

  return (
    <Card style={{ padding: '0.5rem', userSelect: 'none' }} mode="shadow" onClick={onClick}>
      <div style={cardStyle}>
        <div><img style={coverStyle} src={entry.cover()} alt={entry.name()} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <Title level="3" style={{ wordBreak: 'break-word' }}>{entry.name()}</Title>
            <Subhead>{subhead()}</Subhead>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Paragraph style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: 'var(--vkui--font_headline2--font_size--compact)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                <Icon12Favorite style={{ marginRight: 2 }} /> {entry.rating.my}
              </div>
              <div>{entry.series.viewed + '/' + entry.series.total}</div>
            </Paragraph>
            <Progress value={entry.progress()} />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TitleListItem;