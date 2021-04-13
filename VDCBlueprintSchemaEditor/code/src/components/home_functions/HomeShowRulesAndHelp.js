import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import rules from '../../data/rules.json'
import help from '../../data/help.json'

function ShowTheRules () {
  const rulesJson = JSON.parse(JSON.stringify(rules))
  return (
    <>
      <Grid item xs={12} sm={12}>
        <Typography variant='h4' key='title' align='left' gutterBottom>
            Rules:
        </Typography>
      </Grid>
      {Object.entries(rulesJson).map(([name, content]) => (
        <Grid container key={name}>
          <Grid item xs={12} sm={2}>
            <Typography noWrap style={{ whiteSpace: 'pre' }} align='right' gutterBottom>
              <b>{name}:    </b>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={10}>
            <Typography align='left' gutterBottom>
              {content}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </>
  )
}

function ShowHelp () {
  const helpJson = JSON.parse(JSON.stringify(help))
  return (
    <>
      <Grid item xs={12} sm={12}>
        <Typography variant='h4' key='title' align='left' gutterBottom>
          {'Help & Tips:'}
        </Typography>
      </Grid>
      {Object.entries(helpJson).map(([name, content]) => (
        <Grid container key={name}>
          <Grid item xs={12} sm={1}>
            <Typography noWrap style={{ whiteSpace: 'pre' }} align='right' gutterBottom>
              <b>{name}:    </b>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={11}>
            {content.map((line, index) => (
              <Typography key={index} align='left' gutterBottom>
                {line}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12} sm={12}>
            <br />
          </Grid>
        </Grid>
      ))}
    </>
  )
}

export { ShowTheRules, ShowHelp }
