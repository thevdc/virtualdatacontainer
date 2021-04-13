import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grow from '@material-ui/core/Grow';

import ItemString from './simple_fields/ItemString'
import ItemPrefixString from './simple_fields/ItemPrefixString'
import ItemEnum from './simple_fields/ItemEnum'
import ItemBoolean from './simple_fields/ItemBoolean'
import ItemObject from './simple_fields/ItemObject'
import ItemNumber from './simple_fields/ItemNumber'
import ItemConst from './simple_fields/ItemConst'

import IMCinnerOneOfControls from './IMC_components/IMCinnerOneOfControls'
import IMCtitle from './IMC_components/IMCtitle'
import IMCnameWithChevronButton from './IMC_components/IMCnameWithChevronButton'
import IMCarrayItemDeleteButtonAndIndex from './IMC_components/IMCarrayItemDeleteButtonAndIndex'
import IMCarrayNewItemButton from './IMC_components/IMCarrayNewItemButton'

import DeleteIcon from '@material-ui/icons/Delete';

import { IMCfindTheCase } from '../useful_functions/IMCfindTheCase'

var error_path = []
var pixels= {}

class ItemMasterComponent extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {showProp:"",move:0}
  }

//------Buttons With Chevrons-------

  handleChevronClicked = (name,move,page) => {
    let newShow, newMove
    if (this.state.showProp===name){
      newShow = ""
    } else {
      if (this.state.showProp===''){
        newMove = page - 100
      } else {
        newMove = pixels[name]
      }
      newShow = name
    }

    this.setState({
      showProp:newShow,
      move:newMove
    }, this.windowMove)
  }

  windowMove = () => {
    //setting 150ms delay so that the new content has rendered
    //thus auto-scrolling is smoother and does not fail
    setTimeout(() => {
      window.scrollTo({
        top: this.state.move,
        behavior: 'smooth'
      })
    },150)
  }

  buttonRef = (el,name) => {
    // el can be null
    if (!el) return;

    //The proper way save button positions
    if(pixels[name] === undefined){
      pixels={...pixels,[name]:el.offsetTop - 100}
    }
  }

//-------------Contents-------------

  doTheObjectContent = ([name,content],info,path,putSpace) => {
    const doTheSpace = path.length>1

    if(doTheSpace){
      return(
        <Grid container spacing={3}>
          <Grid item xs={12} sm={1} key='objectSpace1'/>
            <Grid item xs={12} sm={11}>
            <Grid container spacing={3}>
              {Object.entries(content).map( (entry,index) => 
                this.doTheSwitch(entry,info.props[entry[0]],[...path,name],-1,false,6)
              )}
            </Grid>
          </Grid>
        </Grid>
      )
    }
    else{
      return(
        <Grid container spacing={3}>
          {Object.entries(content).map( (entry,index) => 
            this.doTheSwitch(entry,info.props[entry[0]],[...path,name],-1,false,6)
          )}
        </Grid>
      )
    }
  }

  doTheArrayContent = ([name,content],info,path,index) => {
    return (
      <Grid container spacing={3}>
        <hr width='98%' align='center' />
        {content.map( (ArrayItem,index) => (
          //<React.Fragment> instead of <> in order to set key prop
          <React.Fragment key={JSON.stringify([...path,name,index])}>
            <IMCarrayItemDeleteButtonAndIndex
              name={name}
              path={path}
              index={index}
              onDelete={this.props.onDelete}
            />
            <Grid item xs={12} sm={1} key='arraySpace1'/>
            <Grid item xs={12} sm={11}>
              <Grid container spacing={3}>
                {Object.entries(ArrayItem).map( item => (
                  this.doTheSwitch(item,info.items[item[0]],[...path,name,index],-1,false,6)
                ))}
              </Grid>
            </Grid>
            <hr width='100%' align='center' color='dadada'/>
          </React.Fragment>
        ))}
        <Grid item xs={12} sm={12}>
          <br/>
        </Grid>
        <IMCarrayNewItemButton
          classes={this.props.classes}
          name={name}
          path={path}
          onNew={this.props.onNew}
        />
        <Grid item xs={12} sm={12}>
          <br/>
        </Grid>
      </Grid>
    )
  }

//----------oneOf contents----------

  doTheObjectOneOf = ([name,content],info,path) => { 
    const {_current_case, casesInfo, casesDesc} = info

    const theCase = (info.casesNOA>0?
                      IMCfindTheCase([...path,name],info.casesArrayItems):
                      _current_case)

    return(
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <IMCinnerOneOfControls
            name={name}
            path={path}
            theCase={theCase}
            casesInfo={casesInfo}
            casesDesc={casesDesc}
            onCaseClicked={this.props.onCaseClicked}
          />
          {Object.entries(content).map( (entry,index) => (
            this.doTheSwitch(entry,casesInfo[theCase][entry[0]],[...path,name],-1,false,6)
          ))}
        </Grid>
      </Grid>
    )
  }

  doTheArrayOneOf = ([name,content],info,path,index) => { 
    const {classes} = this.props
    const {_current_case, casesInfo, casesDesc} = info

    const theCase = (info.casesNOA>0?
                      IMCfindTheCase([...path,name],info.casesArrayItems):
                      _current_case)

    return(
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <IMCinnerOneOfControls
            name={name}
            path={path}
            theCase={theCase}
            casesInfo={casesInfo}
            casesDesc={casesDesc}
            onCaseClicked={this.props.onCaseClicked}
          />
          <hr width='98%' align='center' />
          {content.map( (ArrayItem,index) => (
            //<React.Fragment> instead of <> in order to set key prop
            <React.Fragment key={JSON.stringify([...path,name,index])}>
              <IMCarrayItemDeleteButtonAndIndex
                name={name}
                path={path}
                index={index}
                onDelete={this.props.onDelete}
              />
              {casesInfo[theCase]._type!==undefined
                ?this.doTheSwitch(['',ArrayItem],{type:casesInfo[theCase]._type,req:true,values:casesInfo[theCase].items_values},[...path,name,index],index,false,6)
                ://normal case
                //checking for array padding
                <React.Fragment>
                  <Grid item xs={12} sm={1} key='arraySpace2'/>
                  <Grid item xs={12} sm={11}>
                    <Grid container spacing={3}>
                      {Object.entries(ArrayItem).map( item => (
                        this.doTheSwitch(item,casesInfo[theCase][item[0]],[...path,name,index],-1,false,6)
                      ))}
                    </Grid>
                  </Grid>
                </React.Fragment>
              }
              <hr width='100%' align='center' color='dadada'/>
            </React.Fragment>
          ))}
          <Grid item xs={12} sm={12}>
            <br/>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              className={classes.button}
              variant='contained'
              align='left'
              onClick={() => this.props.onOneOfNew([...path,name])}
            >
              + {name} item
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <br/>
          </Grid>
        </Grid>
      </Grid>
    )
  }

//----------do The Switch-----------

  doTheSwitch = ([name,content],info,path,index,chevronFlag,size) => {

    if (info.type === 'array_oneOf'){
      return (
        <React.Fragment key={name}>
          <Grid key={name} item xs={12} sm={12}>
            <IMCnameWithChevronButton
              name={name}
              desc={info.desc}
              content={content}
              info={info}
              chevronFlag={chevronFlag}
              showProp={this.state.showProp}
              isArray={true}
              buttonRef={this.buttonRef}
              handleChevronClicked={this.handleChevronClicked}
              arraySize={content.length}
            />
          </Grid>
          <br/>
          {chevronFlag?
            (name === this.state.showProp)?
              <Grow in={name === this.state.showProp} timeout={1000}>
                {this.doTheArrayOneOf([name,content],info,path,index)}                
              </Grow>
              :''
            :this.doTheArrayOneOf([name,content],info,path,index)                     
          }
        </React.Fragment>
      )
    }

    if (info.type === 'object_oneOf'){
      return (
        <React.Fragment key={name}>
          <Grid key={name} item xs={12} sm={12}>
            <IMCnameWithChevronButton
              name={name}
              desc={info.desc}
              content={content}
              info={info}
              chevronFlag={chevronFlag}
              showProp={this.state.showProp}
              isArray={false}
              buttonRef={this.buttonRef}
              handleChevronClicked={this.handleChevronClicked}
            />
          </Grid>
          <br/>
          {chevronFlag?
            (name === this.state.showProp)?
              <Grow in={name === this.state.showProp} timeout={1000}>
                {this.doTheObjectOneOf([name,content],info,path)}                
              </Grow>
              :''
            :this.doTheObjectOneOf([name,content],info,path)                     
          }
        </React.Fragment>
      )

    }

    switch (info.type){
      case 'string':
        if(info.pattern!==undefined || info.format!==undefined){
          return (
            <ItemPrefixString
              key={JSON.stringify([...path,name,index])}
              name={name}
              content={content}
              info={info}
              path={path}
              index={index}
              size={size}
              onChange={this.props.onChange}
              onRemove={this.props.onRemove}
              onRestore={this.props.onRestore}
            />
          )
        } else  {
          return (
            <ItemString
              key={JSON.stringify([...path,name,index])}
              name={name}
              content={content}
              info={info}
              path={path}
              index={index}
              size={size}
              onChange={this.props.onChange}
              onRemove={this.props.onRemove}
              onRestore={this.props.onRestore}
            />
          )
        }

      case 'array':
        //if: array item is object or array
        //else: item is string,enum...
        if (typeof info.items === 'object') {
          return (
            <Grid key={name} item xs={12} sm={12}>
              <IMCnameWithChevronButton
                name={name}
                desc={info.desc}
                content={content}
                info={info}
                chevronFlag={chevronFlag}
                showProp={this.state.showProp}
                isArray={true}
                buttonRef={this.buttonRef}
                handleChevronClicked={this.handleChevronClicked}
                arraySize={content.length}
              />
              {chevronFlag?
                (name === this.state.showProp)?
                  <Grow in={name === this.state.showProp} timeout={1000}> 
                    {this.doTheArrayContent([name,content],info,path,index)}
                  </Grow>
                  :''
                :this.doTheArrayContent([name,content],info,path,index)
              }
            </Grid>
          )
        }
        else 
          return (
              <Grid key={name} item xs={12} sm={12}>
                <Typography variant='h6' align='left'>
                  {name + ' (' + content.length + ')' + (info.req?" *":'')}
                </Typography>
                <Typography variant='caption' display="block" gutterBottom align='left'>
                {info.desc}
                </Typography>
                <Grid container spacing={3}>
                  {content.map((ArrayItem,index) => (
                    <React.Fragment key={JSON.stringify([...path,name,index])}>
                      {this.doTheSwitch(['',ArrayItem],{type:info.items,desc:info.items_desc,values:info.items_values},[...path,name,index],index,false,5)}
                      <Grid item xs={12} sm={1} align='left'>
                        <Button
                          variant='contained'
                          align='left'
                          color='secondary'
                          onClick={() => this.props.onDelete([...path,name],index)}
                        >
                          <DeleteIcon/>
                        </Button>
                      </Grid>
                    </React.Fragment>
                  ))}
                  <IMCarrayNewItemButton
                    classes={this.props.classes}
                    name={name}
                    path={path}
                    onNew={this.props.onNew}
                  />
                </Grid>
              </Grid>
            )

      case 'object':
        //if: object elements
        //else: object fields
        if(info.props !== undefined) {
          return (
            <Grid key={name} item xs={12} sm={12}>
              <IMCnameWithChevronButton
                name={name}
                desc={info.desc}
                content={content}
                info={info}
                chevronFlag={chevronFlag}
                showProp={this.state.showProp}
                isArray={false}
                buttonRef={this.buttonRef}
                handleChevronClicked={this.handleChevronClicked}
              />
              <br/>
              {chevronFlag?
                (name === this.state.showProp)?
                  <Grow in={name === this.state.showProp} timeout={1000}>
                    {this.doTheObjectContent([name,content],info,path,false)}                
                  </Grow>
                  :''
                :this.doTheObjectContent([name,content],info,path,true)                     
              }
            </Grid>
          )
        }
        else {
          return (
            <ItemObject
              //using Date().getTime() in the key otherwise it won't update when removing items from array
              key={JSON.stringify([...path,name,index] + new Date().getTime())}
              name={name}
              sectionName={this.props.sectionName}
              content={content}
              info={info}
              path={path}
              index={index}
              size={size}
              onChange={this.props.onObjectChange}
              onRemove={this.props.onRemove}
              onRestore={this.props.onRestore}
            />
          )
        }

      case 'enum':
        if(info.values.length === 1){
          return (
            <ItemConst
              key={JSON.stringify([...path, name, index])}
              name={name}
              content={content}
              info={info}
              path={path}
              index={index}
              size={size}
              onRemove={this.props.onRemove}
              onRestore={this.props.onRestore}
            />
          )
        } else {
          return (
              <ItemEnum
                key={JSON.stringify([...path,name,index])}
                name={name}
                content={content}
                info={info}
                path={path}
                index={index}
                size={size}
                onChange={this.props.onChange}
                onRemove={this.props.onRemove}
                onRestore={this.props.onRestore}
              />
            )
        }

      case 'boolean':
        return (
          <ItemBoolean
            key={JSON.stringify([...path,name,index])}
            name={name}
            content={content}
            info={info}
            path={path}
            index={index}
            size={size}
            onChange={this.props.onBooleanChange}
            onRemove={this.props.onRemove}
            onRestore={this.props.onRestore}
          />
        )

      case 'number':
        return (
          <ItemNumber
            key={JSON.stringify([...path,name,index])}
            name={name}
            content={content}
            info={info}
            path={path}
            index={index}
            size={size}
            onChange={this.props.onChange}
            onRemove={this.props.onRemove}
            onRestore={this.props.onRestore}
          />
        )

      case 'ignore':
        return(
          "ignore: " + name + '. '
        )

      default: {
        throw new Error('ERROR FROM IHO!!!!!!!!!!!!!!!!!! Unsupported type: "'+ info.type + '" in field named: "' + name + '" of section: "' + this.props.sectionName + '"')
      }
    
    }
  }

//----------do The Rest-------------

  doTheRest = () => {
    const {extraPath} = this.props

    var path = [this.props.name]
    //error_path = path

    if(this.props.name === undefined && this.props.isArraySection){
      path = [this.props.current]
    }

    if (extraPath !== -1){
      path = [...path,extraPath]
    }

    //only simple fields have "req" property
    const isSimpleField = this.props.info.req !== undefined

    //alert(JSON.stringify(this.props.data))

    //"if" is true for objects and arrays
    //"else" is true for strings,booleans etc...
    if (typeof this.props.data === 'object' && !isSimpleField){
      const dataEntries = Object.entries(this.props.data)

      //oneOf case for objects
      if(this.props.info._current_case !== undefined){
        const {_current_case} = this.props.info
        return (
          <Grid container spacing={3}>
            {dataEntries.map( item => (
              this.doTheSwitch(item,this.props.info.casesInfo[_current_case][item[0]],path,-1,true,6)
            ))}
          </Grid>
        )
      }

      //normal case
      return (
        <Grid container spacing={3}>
          {dataEntries.map( item => (
            this.doTheSwitch(item,this.props.info[item[0]],path,-1,true,6)
          ))}
        </Grid>
      )
    }
    else {
      const {name,data,info} = this.props
      return (
        this.doTheSwitch([name,data],info,[],-1,false,6)
      )
    }
  }

  printPixels = () => {
    console.log(JSON.stringify(this.state.pixels,null,2))
  }

//----------oneOf Controls----------

  returnOneOfControls = () => {
    const {extraPath} = this.props

    var path = [this.props.name]
    if (extraPath !== -1){
      path = [...path,extraPath]
    }
    if(this.props.info._current_case !== undefined){
        const {_current_case} = this.props.info
        const {casesInfo} = this.props.info

        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant='subtitle1' align='center'>
                <i>Please choose a case for: {this.props.name}</i>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                {casesInfo.map((item,index) => (
                  <Grid key={index} item xs={12} sm={3}>
                    <Button
                      variant='contained'
                      disabled={index === _current_case}
                      color={index !== _current_case?'primary':'default'}
                      align='left'
                      onClick={() => this.props.onCaseClicked(index,path)}
                    >
                      case {index}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1' align='left'>
                "{this.props.info.casesDesc[_current_case]}"
              </Typography>
            </Grid>
          </Grid>
        )
    } else {
      return null
    }
  }

//----------------------------------

  render () {

    error_path = [this.props.name]

    try{
    
      const titleSize = (this.props.info._current_case === undefined? 12 : 6)
      const {name, description, extraPath, isArraySection, current} = this.props
      return ( 
              
          <Grid key={this.props.name} container spacing={4}>
            <IMCtitle
              name={name}
              description={description}
              titleSize={titleSize}
              extraPath={extraPath}
              isArraySection={isArraySection}
              current={current}
              onHeadDelete={this.props.onHeadDelete}
              onArraySectionDelete={this.props.onArraySectionDelete}
            />

            {titleSize === 6? 
              <Grid item xs={6}>
                {this.returnOneOfControls()}
              </Grid>
              :''
            }
            {this.doTheRest()}
          </Grid>
      )

    }catch(err){
      const msg1 = "Critical Input Error found in rendering:"
      const msg2 = "Path: " + JSON.stringify(error_path)
      const msg3 = 'You can continue without ' + JSON.stringify(error_path[error_path.length-1])
      const msg4 = 'or you can return to Home Page in order to change the Input Schema'
      const msg5 = '(Returning to Home Page will result in you losing all your progress)'
      alert(msg1 + '\n' + err + '\n\n' + msg2 + '\n\n' + msg3 + '\n' + msg4 + '\n' + msg5)

      this.props.setErrorList(JSON.stringify(error_path))

      return (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
                noWrap
                variant='h4'
                gutterBottom
                align='left'
                style={{textTransform: 'uppercase', whiteSpace: 'pre'}}
              >
                {this.props.name}
             </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              style={{ color: 'red', whiteSpace: 'pre'}}
              variant='body1'
              display="block"
              gutterBottom
              align='left'
            >
              {msg1 + ' ' + err + '\n\n' + msg2 + '\n\n' + msg3 + ' ' + msg4 + '\n' + msg5}
            </Typography>
          </Grid>
        </Grid>
        )
    }
  }
}

export default ItemMasterComponent
