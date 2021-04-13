import React from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ReplyIcon from '@material-ui/icons/Reply'

function RemoveAndRestoreButton (props) {
  const { showFlag, showRestore, size } = props

  return (
    showFlag
      ? !showRestore
        ? <Grid item align='left' xs={12} sm={size}>
          <IconButton
            variant='contained'
            align='center'
            onClick={props.onRemove}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
        : <Grid item align='left' xs={12} sm={size}>
          <IconButton
            variant='contained'
            align='center'
            onClick={props.onRestore}
          >
            <ReplyIcon />
          </IconButton>
        </Grid>
      : ''
  )
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(RemoveAndRestoreButton, areEqual)
