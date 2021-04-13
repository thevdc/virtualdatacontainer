import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import RemoveAndRestoreButton from '../RemoveAndRestoreButton'

function ItemConst (props) {
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

  // in order to avoid warnings
  const validValue = (typeof content === 'boolean' ? JSON.stringify(content) : content)

  return (
    <>
      <Grid key={JSON.stringify([...path, name, index])} item xs={12} sm={trueSize}>
        <TextField
          required={info.req}
          label={name + ' (constant value)'}
          disabled={disabledFlag}
          fullWidth
          multiline
          helperText={info.desc}
          value={(disabledFlag ? '<REMOVED>' : validValue)}
          InputProps={{
            readOnly: true
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

export default React.memo(ItemConst, areEqual)
