import React from 'react'
import PropTypes from 'prop-types'

const GenreList = ({ children }) => {

  const style = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--vkui--size_base_padding_horizontal--regular)',
    paddingLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
    paddingRight: 'var(--vkui--size_base_padding_horizontal--regular)',
  }

  return (
    <div style={style}>{children}</div>
  )
}

GenreList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ])
}


export default GenreList
  