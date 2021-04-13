import React from 'react'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

function MyDrawerUpper (props) {
  const { drawerItems, current } = props

  return (
    <>
      <List>
        {drawerItems.map((item, index) => (
          <ListItem
            style={index === current ? { backgroundColor: '#d9ddf2' } : {}}
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
      <Divider key='MyDrawerUpper_Divider' />
    </>
  )
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(MyDrawerUpper, areEqual)
