import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

function innerOneOfControls (props) { // (name, path, theCase, casesInfo, casesDesc, onCaseClicked) {
  const { name, path, theCase, casesInfo, casesDesc, onCaseClicked } = props
  return (
    <>
      <Grid item xs={6}>
        <Typography variant='subtitle1' align='center'>
          <i>Please choose a case for: {name}</i>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={1}>
          {casesInfo.map((item, index) => (
            <Grid key={index} item xs={12} sm={3}>
              <Button
                variant='contained'
                disabled={index === theCase}
                color={index !== theCase ? 'primary' : 'default'}
                align='left'
                onClick={() => /* this.props. */onCaseClicked(index, [...path, name])}
              >
                  case {index}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='subtitle1' align='center'>
          {JSON.stringify(casesDesc[theCase])}
        </Typography>
      </Grid>
    </>
  )
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(innerOneOfControls, areEqual)
