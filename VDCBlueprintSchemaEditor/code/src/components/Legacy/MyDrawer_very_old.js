import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MySubDrawer from './MySubDrawer'

export default function MyDrawer (props) {
  const { classes, drawerItems, current, current2, name, subData } = props

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {drawerItems.map((item, index) => (
            <ListItem
              style={index === current ? { backgroundColor: 'lightgray' } : {}}
              button
              key={item}
              onClick={() => props.onItemClick(index)}
            >
              <ListItemText primary={(index === current ? '> ' : '') + item} />
            </ListItem>
          ))}
        </List>
        <Divider />
        {(props.infoArrays.includes(name))// && subData
          ? <MySubDrawer
            classes={classes}
            current2={current2}
            name={name}
            data={subData}
            onNew={props.onSubNew}
            onSubItemClick={props.onSubItemClick}
            returnItemContents={props.returnItemContents}
          />
          : ''}
      </div>
    </Drawer>
  )
}

// we can't use React.memo optimisation because
// the <MySubDrawer/> component won't update when it has to.
