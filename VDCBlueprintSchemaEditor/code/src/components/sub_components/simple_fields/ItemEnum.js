import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import RemoveAndRestoreButton from '../RemoveAndRestoreButton'

function ItemEnum (props) {
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

  const val = (content === undefined ? '' : content)
  const otherFlag = !disabledFlag && (val === 'other' || val === 'Other' || !info.values.includes(val))
  const fakeVal = (info.values.includes('other') ? 'other' : 'Other')

  // if true show TextField
  if (otherFlag) {
    return (
      <>
        <Grid key={JSON.stringify([...path, name, index])} item xs={12} sm={trueSize} align='left'>
          <TextField
            select
            fullWidth
            required={info.req}
            label={name}
            helperText={info.desc}
            value={fakeVal}
            onChange={(e) => props.onChange(e, [...path, name], index)}
          >
            {info.values.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            variant='outlined'
            multiline
            helperText='please type another value'
            value={val}
            onChange={(e) => props.onChange(e, [...path, name], index)}
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
  } else {
    return (
      <>
        <Grid key={JSON.stringify([...path, name, index])} item xs={12} sm={trueSize} align='left'>
          <TextField
            select
            fullWidth
            disabled={disabledFlag}
            required={info.req}
            label={name + (disabledFlag ? '<REMOVED>' : '')}
            helperText={info.desc}
            value={val}
            onChange={(e) => props.onChange(e, [...path, name], index)}
          >
            {info.values.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(ItemEnum, areEqual)
