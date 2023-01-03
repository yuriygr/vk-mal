import React from 'react'
import PropTypes from 'prop-types'

const SubnavigationGrid = ({ children }) => {

  const style = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, auto)',
    gridGap: 'var(--vkui--size_base_padding_horizontal--regular)',
    paddingLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
    paddingRight: 'var(--vkui--size_base_padding_horizontal--regular)',
  }


  return (
    <div style={style}>{children}</div>
  )
}

SubnavigationGrid.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ])
}


export default SubnavigationGrid
  