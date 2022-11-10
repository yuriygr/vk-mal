import React from 'react';
import { ContentCard } from '@vkontakte/vkui';

const GenreThumb = ({ data, onClick }) => {
    
  const name = 
     data.names.russian_name !== "" ? data.names.russian_name : ( 
      data.names.english_name !== "" ? data.names.english_name : (
        data.names.japanese_name !== "" ? data.names.japanese_name : "error"
      )
    )
  

  return (
    <ContentCard
      text={name}
      onClick={onClick}
      style={{ marginBottom: 15 }}
    />
  )
}

export default GenreThumb;
  