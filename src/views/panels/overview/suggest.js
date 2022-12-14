import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Button, ButtonGroup, Panel, PanelHeader, PanelHeaderBack, PanelSpinner } from '@vkontakte/vkui'
import { Icon24Filter, Icon24Switch } from '@vkontakte/icons'

import { TitleThumb } from '@components/titles'

import { Modals } from "@services/const"
import Api from "@services/api"

const SuggestPanel = ({ methods }) => {
  const [ data, setData ] = useState(false)
  const [ gradient, setGradient ] = useState("")
  const [ fetching, setFetching ] = useState(false)

  const fetchSuggest = () => {
    setFetching(true)
    Api.my.suggest()
    .then(data => {
      setData(data)
      setFetching(false)
    })
    .catch(error => {
      setData(false)
      setFetching(false)
    })
  }

  const fetchGradient = () => {
    function createHex() {
      var hexCode1 = "";
      var hexValues1 = "0123456789abcdef";
      
      for ( var i = 0; i < 6; i++ ) {
        hexCode1 += hexValues1.charAt(Math.floor(Math.random() * hexValues1.length));
      }
      return hexCode1 + '90';
    }

    setGradient(`radial-gradient(circle, #${createHex()} 0, #${createHex()} 20%, #${createHex()} 100%)`)
  }

  useEffect(() => {
    fetchSuggest()
  }, [])

  useEffect(() => {
    fetchGradient()
  }, [data])

  const refresh = () => {
    fetchSuggest()
  }

  const filter = () => {
    methods.openModal(Modals.SuggestFilter)
  }

  const wrapperStyle = {
    background: gradient,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '0',
    left: '0',
    paddingBottom: 'inherit',
    paddingTop: 'inherit',
    position: 'absolute',
    right: '0',
    top: '0',
    zIndex: '1'
  }

  const wrapperInnerStyle = {
    width: '225px',
  }

  return (
    <Panel>
      <PanelHeader separator={false} transparent={true} visor={true}
        before={
          <PanelHeaderBack onClick={methods.viewPanelBack} />
        }
      ></PanelHeader>
      
      <div style={wrapperStyle}>
        <div style={wrapperInnerStyle}>
          { fetching && <PanelSpinner /> }
          { !fetching && data &&
            <React.Fragment>
              <TitleThumb key={data.id} data={data} onClick={() => methods.fetchTitle(data)} />
              <ButtonGroup stretched>
                <Button size="l" appearance="overlay" mode="secondary" stretched onClick={refresh}><Icon24Switch /></Button>
                <Button size="l" appearance="overlay" mode="secondary" onClick={filter}><Icon24Filter /></Button>
              </ButtonGroup>
            </React.Fragment>
          }
        </div>
      </div>
    </Panel>
  )
}

SuggestPanel.propTypes = {
  methods: PropTypes.object
}

export default SuggestPanel
  