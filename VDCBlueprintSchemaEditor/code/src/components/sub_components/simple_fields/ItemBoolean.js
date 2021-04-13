import React from 'react'
import Grid from '@material-ui/core/Grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import RemoveAndRestoreButton from '../RemoveAndRestoreButton'

function ItemBoolean (props) {
  const { name, content, info, path, index, size } = props

  // checking index === -1 to avoid array items (because they have their own red button)
  const showFlag = !info.req && index === -1

  // checking content === undefined to disable the field only
  // in this array item and not the others
  const disabledFlag = info.removed && content === undefined
  const iconSize = (disabledFlag ? 2 : 3)
  var trueSize = size
  if (showFlag) {
    trueSize = size - iconSize
  }

  return (
    <>
      <Grid key={JSON.stringify([...path, name, index])} item xs={12} sm={trueSize} align='center'>
        <FormControlLabel
          disabled={disabledFlag}
          control={
            <Checkbox
              // required={info.req} it does npthing
              checked={(content !== undefined ? content : false)}
              onChange={(e) => props.onChange(e, [...path, name], index)}
              name={name}
              color='primary'
            />
          }
          label={name + (disabledFlag ? '<REMOVED>' : '')}
          labelPlacement='start'
          style={{ textTransform: 'uppercase' }}
        />
      </Grid>
      <RemoveAndRestoreButton
        size={iconSize}
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

export default React.memo(ItemBoolean, areEqual)
