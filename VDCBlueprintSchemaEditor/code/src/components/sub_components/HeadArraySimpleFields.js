import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ItemString from './simple_fields/ItemString'
import ItemPrefixString from './simple_fields/ItemPrefixString'
import ItemNumber from './simple_fields/ItemNumber'
import ItemObject from './simple_fields/ItemObject'
import ItemEnum from './simple_fields/ItemEnum'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'

function doTheSwitch (item, info, headName, index, props) {
  switch (info._type) {
    case 'string':
      if (info.pattern !== undefined || info.format !== undefined) {
        return (
          <ItemPrefixString
            name=''
            content={item}
            info={{ ...info, desc: info.items_desc }}
            path={[headName, index]}
            size={5}
            onChange={props.onChange}
          />
        )
      } else {
        return (
          <ItemString
            name=''
            content={item}
            info={{ desc: info.items_desc }}
            path={[headName, index]}
            size={5}
            onChange={props.onChange}
          />
        )
      }

    case 'number':
      return (
        <ItemNumber
          name=''
          content={item}
          info={{ desc: info.items_desc }}
          path={[headName, index]}
          index={index}
          size={5}
          onChange={props.onChange}
        />
      )

    case 'object':
      return (
        <ItemObject
          key={JSON.stringify([headName, index] + new Date().getTime())}
          name=''
          sectionName={props.sectionName}
          content={item}
          info={{ desc: info.items_desc }}
          path={[headName, index]}
          index={index}
          size={5}
          onChange={props.onObjectChange}
        />
      )

    case 'enum':
      return (
        <ItemEnum
          // key={JSON.stringify([...path, name, index])}
          name=''
          content={item}
          info={{ ...info, desc: info.items_desc }}
          path={[headName, index]}
          index={index}
          size={5}
          onChange={props.onChange}
        />
      )

    default:
      return 'HeadArraySimpleFields unknown type case'
  }
}

function returnTitle (name, description) {
  return (
    <Grid item xs={12}>
      <Typography
        noWrap
        variant='h4'
        gutterBottom
        align='left'
        style={{ textTransform: 'uppercase', whiteSpace: 'pre' }}
      >
        {name}
      </Typography>
      <Typography variant='body1' gutterBottom align='left'>
        {JSON.stringify(description)}
      </Typography>
    </Grid>
  )
}

function HeadArraySimpleFields (props) {
  const { name, description, data, info, showTitleFlag } = props

  return (
    <Grid key={name} container spacing={4}>
      {showTitleFlag ? returnTitle(name, description) : ''}

      {data.map((item, index) => (
        <React.Fragment key={JSON.stringify([name, index])}>
          {doTheSwitch(item, info, name, index, props)}
          <Grid item xs={12} sm={1} align='left'>
            <Button
              variant='contained'
              align='left'
              color='secondary'
              onClick={() => props.onDelete(name, index)}
            >
              <DeleteIcon />
            </Button>
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12} sm={12}>
        <Button
          variant='contained'
          align='left'
          onClick={() => props.onNew(name, false)}
        >
          + item
        </Button>
      </Grid>
    </Grid>
  )
}

export default HeadArraySimpleFields
