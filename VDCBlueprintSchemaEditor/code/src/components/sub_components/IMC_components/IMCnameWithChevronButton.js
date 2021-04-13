import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

function IMCnameWithChevronButton (props) {
  const { name, desc, content, info, chevronFlag, showProp, isArray, buttonRef, handleChevronClicked, arraySize } = props
  return (
    <>
      <Typography variant='h5' align='left' style={{ textTransform: 'uppercase' }}>
        {chevronFlag
          ? <Button
            ref={(el) => buttonRef(el, name)}
            style={{ fontSize: 'inherit' }}
            onClick={(e) => { handleChevronClicked(name, e.clientY, e.pageY) }}
          >
            {name + (isArray ? ' (' + content.length + ')' : '')}
            {(name === showProp)
              ? <KeyboardArrowUpIcon />
              : <KeyboardArrowDownIcon />}
          </Button>
          : name + (info.req ? ' *' : '') + (isArray ? ' (' + arraySize + ')' : '')}
      </Typography>
      <Typography variant='caption' display='block' gutterBottom align='left'>
        {desc}
      </Typography>
    </>
  )
}

function areEqual (prevProps, nextProps) {
  // console.log(JSON.stringify(nextProps, null, 2))
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(IMCnameWithChevronButton, areEqual)
