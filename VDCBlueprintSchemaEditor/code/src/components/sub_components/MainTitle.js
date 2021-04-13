import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

function MainTitle (props) {
  return (
    <>
      <Grid item xs={12}>
        <Typography noWrap variant='h3' gutterBottom align='center'>
          {props.name}
        </Typography>
        <Typography variant='subtitle1' gutterBottom align='center'>
          {JSON.stringify(props.description)}
        </Typography>
      </Grid>
      <br />
    </>
  )
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(MainTitle, areEqual)
