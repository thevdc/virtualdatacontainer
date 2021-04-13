import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

function IMCarrayNewItemButton (props) {
  const { classes, name, path, onNew } = props
  return (
    <Grid item xs={12} sm={12}>
      <Button
        className={classes.button}
        variant='contained'
        align='left'
        onClick={() => onNew([...path, name])}
      >
        + {name} item
      </Button>
    </Grid>
  )
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(IMCarrayNewItemButton, areEqual)
