import React from 'react'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

function MyDrawerLower (props) {
  const { /* classes, */ current2, name, data } = props

  const fieldName = props.returnItemContents(data[0], name)[0]

  return (
    <>
      <List>
        <MemorizedMyTypography
          name={name}
          fieldName={fieldName}
        />
        {data.map(
          (item, index) => doForEachItem(name, item, index, current2, props.returnItemContents, props.onSubItemClick)
        )}
      </List>
      <MemorizedNewItemButton
        name={name}
        onNew={props.onNew}
      />
    </>
  )
}

function doForEachItem (name, item, index, current2, returnItemContents, onSubItemClick) {
  const isTheCurrent = (index === current2)
  const itemContent = returnItemContents(item, name)[1]
  return (
    <MemorizedMyListItem
      key={index}
      _style={isTheCurrent ? { backgroundColor: '#d9ddf2' } : {}}
      itemContent={itemContent}
      current2={current2}
      index={index}
      onSubItemClick={onSubItemClick}
    />
  )
}

function areEqualMyListItem (prevProps, nextProps) {
  return JSON.stringify([prevProps.itemContent, prevProps._style]) === JSON.stringify([nextProps.itemContent, nextProps._style])
}

const MemorizedMyListItem = React.memo(MyListItem, areEqualMyListItem)

function MyListItem ({ _style, itemContent, index, current2, onSubItemClick }) {
  return (
    <ListItem
      style={_style}
      button
      onClick={() => onSubItemClick(index)}
    >
      <ListItemText
        disableTypography
        primary={
          <Typography noWrap>
            {(index === current2 ? '> ' : '') + index + ': ' + itemContent}
          </Typography>
        }
      />
    </ListItem>
  )
}

function areEqualMyTypography (prevProps, nextProps) {
  return JSON.stringify(prevProps.name) === JSON.stringify(nextProps.name)
}

const MemorizedMyTypography = React.memo(MyTypography, areEqualMyTypography)

function MyTypography ({ name, fieldName }) {
  return (
    <>
      <Typography>
        {name} Items:
      </Typography>
      <Typography color='textSecondary'>
        "{fieldName}" field
      </Typography>
    </>
  )
}

function areEqualNewItemButton (prevProps, nextProps) {
  return JSON.stringify(prevProps.name) === JSON.stringify(nextProps.name)
}

const MemorizedNewItemButton = React.memo(NewItemButton, areEqualNewItemButton)

function NewItemButton ({ name, onNew }) {
  return (
    <>
      <Divider />
      <Button
        variant='text'
        align='left'
        onClick={() => onNew(name, true)}
      >
        + Item
      </Button>
    </>
  )
}

// we can't use React.memo optimisation for the main component
// because the list items won't update when they have to

export default MyDrawerLower
