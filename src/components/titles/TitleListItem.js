import React from 'react';
import { Title, Subhead, Card, Progress, Paragraph } from '@vkontakte/vkui';
import { Icon12Favorite } from '@vkontakte/icons';

const TitleListItem = ({ data, onClick } ) => {
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

  const date = "2007"

  const cover = "https://cdn.myanimelist.net/r/192x272/images/anime/12/39497.webp?s=0ae299ba10f68551842e8b3108a498f5"

  const name = 
     data.names.russian_name !== "" ? data.names.russian_name : ( 
      data.names.english_name !== "" ? data.names.english_name : (
        data.names.japanese_name !== "" ? data.names.japanese_name : "error"
      )
    )
  

  const progress = () => {
    return (data.series.viewed / data.series.total) * 100
  }

  return (
    <Card style={{ padding: '0.5rem', userSelect: 'none' }} mode="shadow" onClick={onClick}>
      <div style={cardStyle}>
        <div><img style={coverStyle} src={cover} alt={name} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <Title level="3" style={{ wordBreak: 'break-word' }}>{name}</Title>
            <Subhead>{data.type}, {date}</Subhead>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Paragraph style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: 'var(--vkui--font_headline2--font_size--compact)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                <Icon12Favorite style={{ marginRight: 2 }} /> {data.rating.my}
              </div>
              <div>{data.series.viewed + '/' + data.series.total}</div>
            </Paragraph>
            <Progress value={progress()} />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TitleListItem;