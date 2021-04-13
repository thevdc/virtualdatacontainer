import React from 'react'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

export default function MyDrawerLower (props) {
  const { /* classes, */ current2, name, data } = props

  const fieldName = props.returnItemContents(data[0], name)[0]

  const Ret = React.useCallback(() => {
    return (
      <>
        <List>
          <Typography>
            {name} Items:
          </Typography>
          <Typography color='textSecondary'>
            "{fieldName}" field
          </Typography>
          {data.map((item, index) => (
            <ListItem
              style={index === current2 ? { backgroundColor: 'lightgray' } : {}}
              button
              key={index}
              onClick={() => props.onSubItemClick(index)}
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography noWrap>
                    {(index === current2 ? '> ' : '') + index + ': ' + props.returnItemContents(item, name)[1]}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Button
          variant='text'
          align='left'
          onClick={() => props.onNew(name, true)}
        >
          + Item
        </Button>
      </>
    )
  }, [props, current2, name, data])

  return <Ret />
}
