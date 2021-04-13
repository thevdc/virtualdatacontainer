import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

export default function ItemString (props) {
  const { name, content, info, path, index, size } = props

  var trueSize = size
  if (!info.req) {
    trueSize = size - 1
  }

  return (
    <>
      <Grid key={JSON.stringify([...path, name, index])} item xs={12} sm={trueSize}>
        <TextField
          required={info.req}
          label={name}
          fullWidth
          multiline
          helperText={info.desc}
          value={content}
          name={name}
          onChange={(e) => props.onChange(e, [...path, name], index)}
        />
      </Grid>
      {!info.req
        ? <Grid item align='left' xs={12} sm={1}>
          <IconButton
            variant='contained'
            align='center'
            // onClick={this.printPixels}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
        : ''}
    </>
  )
}
