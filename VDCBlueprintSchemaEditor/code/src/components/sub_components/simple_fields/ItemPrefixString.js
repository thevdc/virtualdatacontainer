import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import RemoveAndRestoreButton from '../RemoveAndRestoreButton'
import InputAdornment from '@material-ui/core/InputAdornment'

function ItemPrefixString (props) {
  const { name, content, info, path, index, size } = props

  // checking index === -1 to avoid array items (because they have their own red button)
  const showFlag = !info.req && index === -1

  // checking content === undefined to disable the field only
  // in this array item and not the others
  const disabledFlag = info.removed && content === undefined
  var trueSize = size
  if (showFlag) {
    trueSize = size - 1
  }

  var prefix = 'pattern: ' + JSON.stringify(info.pattern)

  if (info.pattern !== undefined) {
    prefix = 'pattern: ' + JSON.stringify(info.pattern)
  } else if (info.format !== undefined) {
    prefix = 'format: ' + JSON.stringify(info.format)
  } else {
    throw new Error('undefined pattern or format in field: ' + name + '. Path: ' + JSON.stringify(path))
  }

  return (
    <>
      <Grid key={JSON.stringify([...path, name, index])} item xs={12} sm={trueSize}>
        <TextField
          required={info.req}
          disabled={disabledFlag}
          label={name}
          fullWidth
          multiline
          helperText={info.desc}
          value={(disabledFlag ? '<REMOVED>' : content.replace(prefix, ''))}
          onChange={(e) => props.onChange(e, [...path, name], index, prefix)}

          InputProps={{
            startAdornment:
  <InputAdornment
    position='start'
    style={{ color: 'rgba(0, 0, 0, 0.54)' }}
  >
    {prefix}
  </InputAdornment>
          }}

        />
      </Grid>
      <RemoveAndRestoreButton
        size={1}
        showFlag={showFlag}
        showRestore={disabledFlag}
        onRemove={() => props.onRemove([...path, name])}
        onRestore={() => props.onRestore([...path, name])}
      />
    </>
  )
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps.content) === JSON.stringify(nextProps.content)
}

export default React.memo(ItemPrefixString, areEqual)
