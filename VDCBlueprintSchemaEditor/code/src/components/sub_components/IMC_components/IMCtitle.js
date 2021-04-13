import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'

function IMCtitle (props) {
  const { name, description, titleSize, extraPath, isArraySection, current, onHeadDelete, onArraySectionDelete } = props

  return (
    <Grid item xs={titleSize}>
      <Typography
        noWrap
        variant='h4'
        gutterBottom
        align='left'
        style={{ textTransform: 'uppercase', whiteSpace: 'pre' }}
      >
        {name}
      </Typography>
      <Typography variant='body1' gutterBottom align='left'>
        {JSON.stringify(description)}
      </Typography>
      {(extraPath !== -1)
        ? <Typography
          variant='h5'
          gutterBottom
          align='left'
        >
            Item {extraPath + ' '}
          <Button
            variant='contained'
            align='left'
            color='secondary'
            onClick={() => onHeadDelete(name, extraPath)}
          >
            <DeleteIcon />
          </Button>
        </Typography>
        : ''}
      {isArraySection
        ? <Typography
          variant='h5'
          gutterBottom
          align='left'
        >
            Item {current + ' '}
          <Button
            variant='contained'
            align='left'
            color='secondary'
            onClick={() => onArraySectionDelete(current)}
          >
            <DeleteIcon />
          </Button>
        </Typography>
        : ''}
    </Grid>
  )
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(IMCtitle, areEqual)
