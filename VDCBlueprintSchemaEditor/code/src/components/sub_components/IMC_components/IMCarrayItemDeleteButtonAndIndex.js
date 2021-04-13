import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'

function IMCarrayItemDeleteButtonAndIndex (props) {
  const { name, path, index, onDelete } = props
  return (
    <Grid item xs={12} sm={12} align='center'>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant='contained'
          align='center'
          color='secondary'
          onClick={() => onDelete([...path, name], index)}
        >
          <DeleteIcon />
        </Button>
        <Typography variant='h6' gutterBottom style={{ whiteSpace: 'pre' }} align='left' color='textSecondary'>
          {' ' + name} item: {index}
        </Typography>
      </div>
    </Grid>
  )
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(IMCarrayItemDeleteButtonAndIndex, areEqual)
