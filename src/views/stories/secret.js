import React from 'react'
import PropTypes from 'prop-types'

import { Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui'
import { Icon56LikeOutline } from '@vkontakte/icons';

const SecretStory = ({ methods }) => {
  return (
    <Panel>
      <PanelHeader separator={false}
        before={
          <PanelHeaderBack onClick={methods.storyBack} />
        }
      >Секрет</PanelHeader>
      <Placeholder stretched icon={<Icon56LikeOutline style={{ color: 'var(--vkui--color_icon_negative)' }} />}>
        М. А. М.
      </Placeholder>
    </Panel>
  )
}

SecretStory.propTypes = {
  methods: PropTypes.object
}

export default SecretStory
  