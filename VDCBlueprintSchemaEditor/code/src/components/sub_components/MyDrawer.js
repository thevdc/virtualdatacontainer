import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'

import MyDrawerUpper from './MyDrawerUpper'
import MyDrawerLower from './MyDrawerLower'

function MyDrawer (props) {
  const { classes, drawerItems, current, current2, name, subData, subInfo } = props

  // Array with Simple Fields case in "oneOf"
  const ASF_oneOf_case = (subInfo._current_case !== undefined ? subInfo.casesInfo[subInfo._current_case]._type !== undefined : false)
  // Flag for thee subDrawer
  const subDrawerFlag = props.infoArrays.includes(name) && subInfo._type === undefined && !ASF_oneOf_case

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <Toolbar key='MyDrawer_Toolbar' />
      <div className={classes.drawerContainer}>
        <MyDrawerUpper
          key='DrawerUp'
          drawerItems={drawerItems}
          current={current}
          onItemClick={props.onItemClick}
        />
        {subDrawerFlag
          ? <MyDrawerLower
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

export default MyDrawer
