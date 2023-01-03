import React from 'react';
import { Button } from '@vkontakte/vkui';
import { Icon12ChevronOutline } from '@vkontakte/icons';

const GenreThumb = ({ data, onClick }) => {

  const name = 
     data.names.russian_name !== "" ? data.names.russian_name : ( 
      data.names.english_name !== "" ? data.names.english_name : (
        data.names.japanese_name !== "" ? data.names.japanese_name : "error"
      )
    )
  

  return (
    <Button
      size="s"
      mode="outline"
      appearance="neutral"
      after={<Icon12ChevronOutline />}
      onClick={onClick}
    >{name}</Button>
  )
}

export default GenreThumb;
  