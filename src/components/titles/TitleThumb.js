import React from 'react';
import { ContentCard } from '@vkontakte/vkui';

const TitleThumb = ({ data, onClick }) => {
  return (
    <ContentCard
      src={data.cover}
      text={data.name}
      subtitle={data.type + ', ' + data.date}
      onClick={onClick}
      style={{ marginBottom: 15 }}
    />
  )
}

export default TitleThumb;
  