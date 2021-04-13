import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

export default function MyArrayDrawer (props) {
  const { classes, drawerItems, current } = props

  const Ret = React.useCallback(() => {
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
            <Typography color='textSecondary'>
              "{props.returnItemContents(drawerItems[0], null, true)[0]}" field
            </Typography>
            {drawerItems.map((item, index) => (
              <ListItem
                style={index === current ? { backgroundColor: 'lightgray' } : {}}
                button
                key={JSON.stringify(index + ' ' + new Date().getTime())}
                onClick={() => props.onItemClick(index)}
              >
                <ListItemText
                  primaryTypographyProps={{ noWrap: true }}
                  primary={(index === current ? '> ' : '') + index + ': ' + props.returnItemContents(item, null, true)[1]}
                />
              </ListItem>
            ))}
          </List>
          <Divider key='MyArrayDrawer_Divider' />
          <Button
            key='MyArrayDrawer_Button'
            variant='text'
            align='left'
            onClick={props.onNewTopItem}
          >
            + Item
          </Button>
        </div>
      </Drawer>
    )
  }, [props, classes, current, drawerItems])

  return <Ret />
}

// we can't use React.memo optimisation because
// the <MySubDrawer/> component won't update when it has to.
