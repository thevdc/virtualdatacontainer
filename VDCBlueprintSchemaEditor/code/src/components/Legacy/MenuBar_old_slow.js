import React from 'react'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

export default function MenuBar (props) {
  const { classes } = props

  const Ret = React.useCallback(() => {
    return (
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Grid item xs={12} sm={3}>
            <Typography variant='h4' align='left' noWrap>
              <b>{props.sections[props.sectionNo]}</b>
            </Typography>
          </Grid>
          <Grid container>
            {props.sections.map((label, index) => (
              <Grid item xs={12} sm={3} key={index}>
                <Typography variant='h6' align='center' noWrap>
                  <Link href='#' onClick={() => props.menuClicked(index)} color='inherit'>
                    <b>{label}</b>
                  </Link>
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Toolbar>
      </AppBar>
    )
  }, [props, classes.appBar])

  return <Ret />
}
