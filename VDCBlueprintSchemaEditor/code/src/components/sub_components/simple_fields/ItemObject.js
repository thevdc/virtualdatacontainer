import React, { useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import PriorityHighIcon from '@material-ui/icons/PriorityHigh'
import RemoveAndRestoreButton from '../RemoveAndRestoreButton'

import { writeTab } from '../../useful_functions/writeTab'

function ItemObject (props) {
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

  const [oldJson, setOldJson] = React.useState(JSON.stringify(content, null, '\t'))
  const [json, setJson] = React.useState(JSON.stringify(content, null, '\t'))

  var ref = useRef()

  return (
    <>
      <Grid key={JSON.stringify([...path, name, index])} item xs={12} sm={trueSize}>
        <TextField
          id='my-textarea'
          required={info.req}
          disabled={disabledFlag}
          label={name}
          fullWidth
          multiline
          rowsMax={10}
          rows={disabledFlag ? 1 : 10}
          variant='outlined'
          helperText={info.desc === undefined ? ' ' : info.desc}
          value={disabledFlag ? '<REMOVED>' : json}
          onChange={e => { setJson(e.target.value) }}
          inputRef={el => ref = el}
          onKeyDown={(e) => {
            writeTab(e, ref)
            setJson(e.target.value)
          }}
          name={name}
          InputProps={{
            endAdornment:
              json === oldJson
                ? <CheckCircleOutlineIcon color='primary' />
                : <PriorityHighIcon color='secondary' />
          }}
        />
        <Button
          variant='contained'
          align='left'
          disabled={json === oldJson}
          color={json === oldJson ? 'default' : 'primary'}
          onClick={() => parseAndSend(props, json, setJson, setOldJson)}
        >
          Parse
        </Button>
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

function parseAndSend (props, json, setJson, setOldJson) {
  const { name, path, index, sectionName, onChange } = props
  var toSend
  try {
    toSend = JSON.parse(json)
    onChange(toSend, [...path, name], index)
    // updating the value that "parse button" checks
    setJson(JSON.stringify(toSend, null, '\t'))
    setOldJson(JSON.stringify(toSend, null, '\t'))
  } catch (err) {
    var pathString = sectionName
    var p
    for (var i = 0; i < path.length; i++) {
      p = path[i]
      if (typeof p === 'number') {
        pathString = pathString + '[' + p + ']'
      } else {
        pathString = pathString + '.' + p
      }
    }
    pathString = pathString + (name === '' ? '' : '.' + name)
    const message = 'JSON value was not saved in field: "' + pathString + '" due to parsing error:\n' + err
    setTimeout(() => alert(message), 200)
  }
}

function areEqual (prevProps, nextProps) {
  console.log(JSON.stringify(prevProps.content) === JSON.stringify(nextProps.content))
  return JSON.stringify(prevProps.content) === JSON.stringify(nextProps.content)
}

export default React.memo(ItemObject, areEqual)
