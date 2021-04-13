import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MySubDrawer from './MySubDrawer'

export default function MyDrawer (props) {
  const { classes, drawerItems, current, current2, name, subData, subInfo } = props

  // Array with Simple Fields case in "oneOf"
  const ASF_oneOf_case = (subInfo._current_case !== undefined ? subInfo.casesInfo[subInfo._current_case]._type !== undefined : false)
  // Flag for thee subDrawer
  const subDrawerFlag = props.infoArrays.includes(name) && subInfo._type === undefined && !ASF_oneOf_case

  const Ret = React.useCallback(() => {
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
                <ListItemText
                  disableTypography
                  primary={
                    <Typography noWrap>
                      <b>{(index === current ? '> ' : '') + item}</b>
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          {/* console.log(JSON.stringify(subKeys, null, 2)) */}
          {subDrawerFlag// (props.infoArrays.includes(name) && !subKeys.includes('_type'))
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
  }, [props, classes, current, current2, drawerItems, name, subData, subDrawerFlag])

  return <Ret />
}

// we can't use React.memo optimisation because
// the <MySubDrawer/> component won't update when it has to.
