import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

function MyArrayDrawer (props) {
  const { classes, drawerItems, current } = props
  const fieldName = props.returnItemContents(drawerItems[0], null, true)[0]

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <Toolbar key='MyArrayDrawer_Toolbar' />
      <div className={classes.drawerContainer}>
        <List>
          <MemorizedMyTypography
            fieldName={fieldName}
          />
          {drawerItems.map(
            (item, index) => doForEachItem(item, index, current, props.returnItemContents, props.onItemClick)
          )}
        </List>
        <MemorizedNewItemButton
          onNewTopItem={props.onNewTopItem}
        />
      </div>
    </Drawer>
  )
}

function doForEachItem (item, index, current, returnItemContents, onItemClick) {
  const isTheCurrent = (index === current)
  const itemContent = returnItemContents(item, null, true)[1]
  return (
    <MemorizedMyListItem
      key={index}
      _style={isTheCurrent ? { backgroundColor: '#d9ddf2' } : {}}
      itemContent={itemContent}
      current={current}
      index={index}
      onItemClick={onItemClick}
    />
  )
}

// using React.memo optimisation in order to reduce unnecessary rendering
const MemorizedMyTypography = React.memo(MyTypography, () => true)

function MyTypography ({ fieldName }) {
  return (
    <Typography key='typ' color='textSecondary'>
      "{fieldName}" field
    </Typography>
  )
}

const MemorizedMyListItem = React.memo(MyListItem, areEqualMyListItem)

function MyListItem ({ _style, itemContent, current, index, onItemClick }) {
  return (
    <ListItem
      style={_style}
      button
      onClick={() => onItemClick(index)}
    >
      <ListItemText
        primaryTypographyProps={{ noWrap: true }}
        primary={(index === current ? '> ' : '') + index + ': ' + itemContent}
      />
    </ListItem>
  )
}

function areEqualMyListItem (prevProps, nextProps) {
  return JSON.stringify([prevProps.itemContent, prevProps._style]) === JSON.stringify([nextProps.itemContent, nextProps._style])
}

const MemorizedNewItemButton = React.memo(NewItemButton, () => true)

function NewItemButton ({ onNewTopItem }) {
  return (
    <>
      <Divider key='MyArrayDrawer_Divider' />
      <Button
        key='MyArrayDrawer_Button'
        variant='text'
        align='left'
        onClick={onNewTopItem}
      >
        + Item
      </Button>
    </>
  )
}

// we can't use React.memo optimisation for the main component
// because the list items won't update when they have to

export default MyArrayDrawer
