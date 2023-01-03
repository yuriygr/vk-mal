import React from 'react'
import { Banner, Button } from '@vkontakte/vkui'

import { Stories, Views, Panels } from "@services/const"

const HelloBlock = ({ methods }) => {

  const background = (
    <div
      style={{
        backgroundColor: "#65c063",
        backgroundImage:
          "url(https://sun9-59.userapi.com/7J6qHkTa_P8VKRTO5gkh6MizcCEefz04Y0gDmA/y6dSjdtPU4U.jpg)",
        backgroundPosition: "right bottom",
        backgroundSize: 320,
        backgroundRepeat: "no-repeat",
      }}
    />
  )

  return (
    <Banner
        mode="image"
        header="Приветствую Вас"
        subheader="Приложение пока-что не работает, а что работает вы можете прочитать по кнопочке ниже"
        background={background}
        actions={<Button appearance="overlay" onClick={() => methods.go(Stories.Main, Views.Main.Overview, Panels.Main.Overview.Hello) }>Подробнее</Button>}
      />
  );
}

export default HelloBlock
