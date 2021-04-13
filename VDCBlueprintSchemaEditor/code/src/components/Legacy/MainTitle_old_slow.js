import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

export default function MainTitle (props) {
  const Ret = React.useCallback(() => {
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
  }, [props])

  return <Ret />
}
