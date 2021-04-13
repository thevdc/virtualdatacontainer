
import React, { Component } from 'react'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import ItemMasterComponent from './sub_components/ItemMasterComponent'
import MenuBar from './sub_components/MenuBar'
import MyArrayDrawer from './sub_components/MyArrayDrawer'
import MyDrawer from './sub_components/MyDrawer'
import MainTitle from './sub_components/MainTitle'
import ControlButtons from './sub_components/ControlButtons'
import HeadArraySimpleFields from './sub_components/HeadArraySimpleFields'

import { deepCopy } from './useful_functions/deepCopy'

const drawerWidth = 280

const useStyles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: 'transparent'
  },
  drawerContainer: {
    overflow: 'auto'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },


  ///
  listItemText:{
    maxWidth: 260
  },

  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    fontWeight: 'bold',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    backgroundColor: '#d9ddf2',

    '&:hover': {
      background: '#b4bbe4'
    }
  },
  buttonMain: {
    fontWeight: 'bold',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
})

class Section extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {...props.masterState,...this.makeTheState()};
  }

//-----------handle Send------------

  handleLogSend = () => {
    const msg = JSON.stringify(this.state,null,2)
    console.log(msg)
    alert(msg)
  }

  handleLogInfo = () => {
    const msg = JSON.stringify(this.state.info,null,2)
    console.log(msg)
    alert(msg)
  }

//------------do Stuff--------------

  menuClicked = (index) => {
    this.props.menuClicked(this.state,index)
  }

  handleDrowerClick = (index) => {
    if(this.state.current!==index){
      this.setState({
        current: index,
        current2: -1
      })
    }
  }

  handleSubDrowerClick = (index) => {
    if(this.state.current2!==index){
      this.setState({
        current2: index
      })
    }
  }

//-----------do The Rest------------

  doTheRest = (current) => {
    const { classes } = this.props
    const name = Object.keys(this.state.output)[current]
    const description = this.state.info_Desc[name]
    const data = Object.values(this.state.output)[current]
    const info = Object.values(this.state.info)[current]
    const {current2} = this.state

    var propData = data
    var propExtraPath = -1
    var propOnHeadDelete = null

    if (this.state.info_Arrays.includes(name)){

      //Head Array with simple fields
      if(info._type !== undefined){
        return <HeadArraySimpleFields 
                showTitleFlag={true}
                name={name}
                sectionName={this.state.sections[this.props.sectionNo]}
                description={description}
                data={data}
                info={info}
                onChange={this.handleMasterChange}
                onObjectChange={this.handleObjectChange}
                onNew={this.handleHeadNew}
                onDelete={this.handleHeadDelete}
               />
      }

      //Set props to show current item
      if(current2 !== -1) {
        propData=data[current2]
        propExtraPath = current2
        propOnHeadDelete = this.handleHeadDelete
      }
      //Show the list of items
      else {
        const {_current_case} = info
        const {casesInfo} = info
        const titleSize = (_current_case === undefined? 12 : 6 )

        return (
          <Grid container spacing={4}>
            <Grid item xs={12} sm={titleSize} align="center">
              <Typography variant='h4' gutterBottom align='left' noWrap style={{textTransform: 'uppercase'}}>
                {name}
              </Typography>
              <Typography variant='body1' gutterBottom align='left'>
                {JSON.stringify(description)}
              </Typography>
              <Typography variant='h5' gutterBottom align='left'>
                Items:
              </Typography>
            </Grid>
            
            {info._current_case !== undefined?
              <Grid item xs={12} sm={6} align="center">
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant='subtitle1' align='center'>
                      <i>Please choose a case for: {name}</i>
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
                            onClick={() => this.masterCaseClicked(index,[name,0])}//adding '0' to get in the second 'if' of masterCaseClicked
                          >
                            case {index}
                          </Button>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Typography variant='subtitle1' align='left'>
                          "{info.casesDesc[_current_case]}"
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
                :''
              
              }
            
            {casesInfo !== undefined
              ? casesInfo[_current_case]._type !== undefined
                ?<HeadArraySimpleFields
                  showTitleFlag={false}
                  current={current2}
                  name={name}
                  sectionName={this.state.sections[this.props.sectionNo]}
                  //description={description}
                  data={data}
                  info={casesInfo[_current_case]}
                  onChange={this.handleMasterChange}
                  onObjectChange={this.handleObjectChange}
                  onNew={this.handleHeadNew}
                  onDelete={this.handleHeadDelete}
                 />
                : this.listOfArrayItems(current)                
              :this.listOfArrayItems(current)
            }           
          </Grid>
        )
      }
    } 
    return (
      
      <ItemMasterComponent
        classes={classes}
        setGOflag={this.props.setGOflag}
        setCheckFlag={this.props.setCheckFlag}
        setActiveStep={this.props.setActiveStep}
        setErrorList={this.props.setErrorList}
        name={name}
        sectionName={this.state.sections[this.props.sectionNo]}
        description={description}
        data={propData}
        info={info}
        extraPath={propExtraPath}
        current2={current2}
        onChange={this.handleMasterChange}
        onBooleanChange={this.handleBooleanChange}
        onObjectChange={this.handleObjectChange}
        onNew={this.handleMasterNew}
        onOneOfNew={this.handleOneOfNew}
        onDelete={this.handleMasterDelete}
        onHeadDelete={propOnHeadDelete}
        onRemove={this.handleMasterRemove}
        onRestore={this.handleMasterRestore}
        onCaseClicked={this.masterCaseClicked}
        errorRemove={this.errorRemove}
      />
      
    )
  }

  doTheRestArraySection = () => {
    const { classes } = this.props
    const {current} = this.state
    if(current===-1){
      return this.listOfArraySectionItems()
    }
    else {
      return (
        
        <ItemMasterComponent
          classes={classes}
          setGOflag={this.props.setGOflag}
          setCheckFlag={this.props.setCheckFlag}
          setActiveStep={this.props.setActiveStep}
          setErrorList={this.props.setErrorList}
          sectionName={this.state.sections[this.props.sectionNo]}
          data={this.state.output[current]}
          info={this.state.info}
          extraPath={-1}
          isArraySection={true}
          current={current}
          onChange={this.handleMasterChange}
          onBooleanChange={this.handleBooleanChange}
          onObjectChange={this.handleObjectChange}
          onNew={this.handleMasterNew}
          onOneOfNew={this.handleOneOfNew}
          onDelete={this.handleMasterDelete}
          onArraySectionDelete={this.handleArraySectionDelete}
          onRemove={this.handleMasterRemove}
          onRestore={this.handleMasterRestore}
          onCaseClicked={this.masterCaseClicked}
          errorRemove={this.errorRemove}
        />
        
      )
    }
  }

  listOfArraySectionItems = (current) => {
    const data = this.state.output
    return (
      <>
        <Grid item xs={12} sm={12} align="center">
            <List>
              {data.map((item, index) => (
                <ListItem
                  style = {{backgroundColor: "#eeeeee",border: '1px solid white',borderRadius: '10px'}}
                  button
                  key={index}
                  onClick={() => this.handleDrowerClick(index)}
                >
                  <ListItemText
                    align="left"
                    primary={"ITEM " + index + ":\t" + this.packItemContents(item,null,true)}
                    style={{ whiteSpace: 'pre'}}// enables '\t', '\n' & spaces
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              variant='contained'
              align='left'
              onClick={this.handleArraySectionNew}
            >
              + Item
            </Button>
          </Grid>
      </>
    )
  }

  listOfArrayItems = (current) => {
    const {classes} = this.props
    const name = Object.keys(this.state.output)[current]
    const data = Object.values(this.state.output)[current]
    return (
        <>
          <Grid item xs={12} sm={12} align="center">
            <List>
              {data.map((item, index) => (
                <ListItem
                  style = {{backgroundColor: "#d9ddf2",border: '1px solid white',borderRadius: '10px'}}
                  button
                  key={index}
                  onClick={() => this.handleSubDrowerClick(index)}
                >
                  <ListItemText
                    align="left"
                    primary={"ITEM " + index + ":\t" + this.packItemContents(item,name)}
                    style={{ whiteSpace: 'pre'}}// enables '\t', '\n' & spaces
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              className={classes.button}
              variant='contained'
              align='left'
              onClick={() => this.handleHeadNew(name,true)}
            >
              + Item
            </Button>
          </Grid>
       </>
    )
  }

  packItemContents = (item,headName,isArraySection) => {
    const [name,content] = this.returnItemContents(item,headName,isArraySection)
    return (name + ': ' + content)
    //return "to be changed"
  }

  returnItemContents = (item,headName,isArraySection) => {
    const {info} = this.state
    var retName = '', retCont, info_pointer, entries

    //
    //return ["to be changed","to be changed"]

    if(item===undefined){
      return ["undefined",'']
    }

    if(isArraySection){
      info_pointer = info
    }
    else {
      const keys = Object.keys(info[headName])
      const {_current_case} = info[headName]
      info_pointer = (keys[0]==='_current_case'?
                              info[headName].casesInfo[_current_case]:
                              info[headName])
    }

    entries = Object.entries(item)
    var i, name, content
    for(i=0;i<entries.length;i++){
      name = entries[i][0]
      content = entries[i][1]
      

      if(info_pointer[name].req && typeof content !== 'object'){
        retName = name
        if (content === '') {
          retCont = "<Empty>"
        } else {
          retCont = content
        }
        break;
      }
    }

    if (retName === ''){
      return [retName,'no "required" fields to show']
    } else{
      return [retName,retCont]
    }
  }

//----------------------------------

  out = (message) =>{
    console.log(JSON.stringify(message,null,2))
  }

//----------handle Change-----------

  handleMasterChange = (e,path,SC_index,prefix) => {

    //console.log(JSON.stringify(path))
    //alert(JSON.stringify(path))

    var {value} = e.target

    if(prefix!==undefined){
      value = prefix+value
    }

    var {output} = this.state

    if (path.length === 1) {
      output[path[0]] = value
      this.setState(() => ({output}))
    }
    else {
      var pointer = output[path[0]]
      var i,p;
      for (i = 1; i < path.length-1; i++) {
        p = path[i]
        //Special Case
        if (SC_index !== -1 && i === path.length-2) {
          break;
        } else {
          pointer = pointer[p]
        }
      }
      pointer[path[i]] = value
      this.setState(() => ({output}))
      //window.requestIdleCallback(() => this.setState({ output }));
    }
  }

  handleBooleanChange = (e,path,SC_index) => {

    //console.log(JSON.stringify(path))

    const {checked} = e.target

    var {output} = this.state

    if (path.length === 1) {
      output[path[0]] = checked
      this.setState(() => ({output}))
    } else {
      var pointer = output[path[0]]
      var i,p;
      for (i = 1; i < path.length-1; i++) {
        p = path[i]
        //Special Case
        if (SC_index !== -1 && i === path.length-2) {
          break;
        } else {
          pointer = pointer[p]
        }
      }
      pointer[path[i]] = checked

      this.setState(() => ({output}))
    }
  }

  handleObjectChange = (json,path,SC_index) => {

    //console.log(JSON.stringify(path))

    var {output} = this.state
    
    if (path.length === 1) {
      output[path[0]] = json
      this.setState(() => ({output}))
    } else {
      var pointer = output[path[0]]
      var i,p;
      for (i = 1; i < path.length-1; i++) {
        p = path[i]
        //Special Case
        if (SC_index !== -1 && i === path.length-2) {
          break;
        } else {
          pointer = pointer[p]
        }
      }

      pointer[path[i]] = json
      this.setState(() => ({output}))
    }
  }

//-----------handle New-------------

  returnFromInfo = (pathOld,infoProp) => {
    var {info} = this.state
    var pointer
    var path = JSON.parse(JSON.stringify(pathOld))

    //console.log(JSON.stringify(path))
    //console.log(JSON.stringify(info,null,2))
    var isArraySection=false
    if(typeof pathOld[0]=='number'){
      path.shift()
      isArraySection=true
    }

    pointer = info[path[0]]
    var i,p;
    for (i = 1; i < path.length; i++) {
      p = path[i]

      if(pointer._current_case !== undefined){
        pointer = pointer.casesInfo[pointer._current_case]
      }
      
      if (pointer.props !== undefined) {
        pointer = pointer.props
      }

      if (typeof p == 'number') {
        //ignore first index in case of array head_property
        //or skipping problematic case of not having "items" property
        //in "info" when using "casesInfo"
        if(i===1 || pointer.items===undefined) {continue;}
        pointer = pointer.items
      }
      else {
        pointer = pointer[p]
      }
      if (pointer.type === 'object'){
        pointer = pointer.props
      }
    }

    //console.log(JSON.stringify(pointer,null,2))
    //parsing the stringified object will make a new copy
    if(infoProp==="items_template"){
      return JSON.parse(JSON.stringify(pointer.items_template))
    }
    else if(infoProp==="oneOfCase"){
      var thePath = path
      if(isArraySection){
        thePath = pathOld
      }
      const theCase = (pointer.casesNOA>0?
                      this.findTheCase(thePath,pointer.casesArrayItems):
                      pointer._current_case)
      //console.log(JSON.stringify(theCase))
      return JSON.parse(JSON.stringify(pointer.casesTemplates[theCase]))
    }
    //else: infoProp === "minItems"
    else {
      return pointer.minItems
    }
  }

  handleMasterNew = (path) => {
    
    var {output} = this.state
    var pointer

    pointer = output[path[0]]
    var i;
    for (i = 1; i < path.length-1; i++) {
      pointer = pointer[path[i]]
    }

    const newItem = this.returnFromInfo(path,"items_template")
    //if we do  pointer = [...pointer,newItem] , the change won't happen in setState
    pointer[path[i]] = [...pointer[path[i]],newItem]

    this.setState(() => ({output}))
  }

  handleOneOfNew = (path) => {

    var {output} = this.state
    var pointer

    pointer = output[path[0]]
    var i;
    for (i = 1; i < path.length-1; i++) {
      pointer = pointer[path[i]]
    }

    const newItem = this.returnFromInfo(path,"oneOfCase")
    //if we do  pointer = [...pointer,newItem] , the change won't happen in setState
    pointer[path[i]] = [...pointer[path[i]],newItem]

    this.setState(() => ({output}))
  }

  handleHeadNew = (propName,setCurrent2) => {
    const {output} = this.state
    var template = JSON.parse(JSON.stringify(this.state.head_Templates[propName]))
    output[propName] = [...output[propName],template]
    const newCurrent2 = (setCurrent2? output[propName].length-1 : -1)

    this.setState(() => ({output,current2:newCurrent2}))
  }

  handleArraySectionNew = () => {
    var {output} = this.state
    const template = JSON.parse(JSON.stringify(this.state.template))
    output = [...output,template]
    const current = output.length-1

    this.setState(() => ({output,current}))
  }

//----------handle Delete-----------

  handleMasterDelete = (path,index) => {
    //alert(JSON.stringify(path))

    var {output} = this.state
    var pointer

    pointer = output[path[0]]

    var i
    for (i = 1; i < path.length-1; i++) {
      pointer = pointer[path[i]]
    }

    const min = this.returnFromInfo(path,"minItems")
    if (pointer[path[i]].length === min) {
      alert('Cannot delete item. "' + path[i] + '" array should contain at least '+min+' item(s)')
    } 
    else {
      if(window.confirm('Delete "' + path[i] + '" item ' + index + '?')){
        pointer[path[i]].splice(index,1)
        this.informLowerOneOfs(path,index)

        this.setState(() => ({output}))
      }
    } 
  }

  headInformLowerOneOfs = (propName,index) => {
    if(this.state.head_lowerOneOfs[propName]!==undefined){
      //keeping the same name 'lowerOneOfs'
      const lowerOneOfs = this.state.head_lowerOneOfs[propName]
      const LowerOneOfSize = lowerOneOfs.length
      var lowSize,p
      var infoPointer
      var i,j;
      for(i=0;i<LowerOneOfSize;i++){
        infoPointer = this.state.info[propName]
        lowSize = lowerOneOfs[i].length
        for(j=2;j<lowSize;j++){
          p = lowerOneOfs[i][j]
          if(p === '_num_'){
            infoPointer = infoPointer.items
          }
          else if(infoPointer.type === 'object'){
            infoPointer = infoPointer.props[p]
          }
          else{
            infoPointer = infoPointer[p]
          }
        }
        infoPointer = infoPointer.casesArrayItems

        infoPointer.splice(index,1)
      }
    }
  }

  informLowerOneOfs = (path,index) => {
    var startInfoPointer = this.returnInfoForRemove(path)
    //+ one step
    startInfoPointer = startInfoPointer[path[path.length-1]]

    if(startInfoPointer.lowerOneOfs!==undefined){
      const {lowerOneOfs} = startInfoPointer
      const LowerOneOfSize = lowerOneOfs.length
      const pathLength = path.length
      var lowSize,p,infoPointer
      const arrayPath = path.filter(function (item) {
        return (parseInt(item) === item);
      })
      var i,j;
      for(i=0;i<LowerOneOfSize;i++){
        //initializing infoPointer of each loop
        infoPointer = startInfoPointer
        lowSize = lowerOneOfs[i].length
        for(j=pathLength;j<lowSize;j++){
          p = lowerOneOfs[i][j]
          if(p === '_num_'){
            infoPointer = infoPointer.items
          }
          else if(infoPointer.type === 'object'){
            infoPointer = infoPointer.props[p]
          }
          else{
            infoPointer = infoPointer[p]
          }
        }
        infoPointer = infoPointer.casesArrayItems
        for(j=0;j<arrayPath.length;j++){
          if(infoPointer[arrayPath[j]] === undefined){break;}
          else{
            infoPointer = infoPointer[arrayPath[j]]
          }
        }
        if(j === arrayPath.length){
          infoPointer.splice(index,1)
        }
      }
    }
  }

  arraySectionInformLowerOneOfs = (index) => {
    //keeping the same name 'lowerOneOfs'
    const lowerOneOfs = this.state.info_lowerOneOfs
    const LowerOneOfSize = lowerOneOfs.length
    var lowSize,p
    var infoPointer
    var i,j;
    for(i=0;i<LowerOneOfSize;i++){
      infoPointer = this.state.info
      lowSize = lowerOneOfs[i].length
      for(j=1;j<lowSize;j++){
        p = lowerOneOfs[i][j]
        if(p === '_num_'){
          infoPointer = infoPointer.items
        }
        else if(infoPointer.type === 'object'){
          infoPointer = infoPointer.props[p]
        }
        else{
          infoPointer = infoPointer[p]
        }
      }
      infoPointer = infoPointer.casesArrayItems

      infoPointer.splice(index,1)
    }
  }

  returnHeadMinItems = (propName) => {
    const ret = this.state.minimum_Items[propName]
    if (ret === undefined) {
      return -1
    } else {
      return ret
    }
  }

  handleHeadDelete = (propName,index)  => {
    const {output} = this.state

    const min = this.returnHeadMinItems(propName)
    if (output[propName].length === min){
      alert("Cannot delete item. " +JSON.stringify(propName)+" array should contain at least "+min+" item(s)")
    } else {
      if(window.confirm("Delete " + propName + " item " + index + "?")){
        output[propName].splice(index,1)
        const current2 = -1
        this.headInformLowerOneOfs(propName,index)

        this.setState(() => ({output,current2}))
      }
    }
  }

  handleArraySectionDelete = (index) => {
    var {output} = this.state
    const min = this.state.minimum_Items
    if (output.length === min){
      alert('Cannot delete item. "'+this.props.sectionName+'" array should contain at least '+min+' item(s)')
    }
    else{
      if(window.confirm('Delete "' + this.props.sectionName + '" item ' + index + '?')){
        output.splice(index,1)
        this.arraySectionInformLowerOneOfs(index)

        this.setState(() => ({output,current:-1}))
      }
    }
  }

//----------handle Remove-----------

  returnInfoForRemove = (pathOld,isCaseClicked) => {
    var {info} = this.state
    var pointer, isArraySection = false

    var path = JSON.parse(JSON.stringify(pathOld))

    
    // console.log(JSON.stringify(path))

    //This is for ArraySections. Ignoring the first index the
    if(typeof pathOld[0]=='number'){
      path.shift()
      isArraySection = true
    }

    // console.log(JSON.stringify(path))

    if(path.length===1 && !isCaseClicked){
      return info
    }

    pointer = info[path[0]]
    var i,p;

    // console.log(JSON.stringify(pointer,null,2))
    //alert(JSON.stringify(path))

    //careful! It is different from return from info: i < path.length-1 !!!
    for (i = 1; i < path.length-1; i++) {
      
      p = path[i]
      // console.log(p)



      if(pointer._current_case !== undefined){
        if(pointer.casesNOA !== undefined) {
          //passing pathOld in order to keep the first index in findTheCase
          pointer = pointer.casesInfo[this.findTheCase(pathOld,pointer.casesArrayItems,i)]
        }
        else{
          pointer = pointer.casesInfo[pointer._current_case]
        }
      }

      // console.log(JSON.stringify(pointer,null,2))
      if (pointer.props !== undefined) {
        pointer = pointer.props
      }
      // console.log(JSON.stringify(pointer,null,2))
      if (typeof p == 'number') {
        //ignore first index in case of array head_property
        if((i===1 && !isArraySection) || pointer.items===undefined) {continue;}
        

        if (pointer.type === 'array_oneOf'){
          if(pointer.casesNOA === undefined) {
            //alert(pointer.casesNOA)
            pointer = pointer.casesInfo[pointer._current_case]
          }
        }
        else{
          pointer = pointer.items
        }

      } else {
        pointer = pointer[p]
      }
      // console.log(JSON.stringify(pointer,null,2))
      if (pointer.type === 'object'){
        pointer = pointer.props
      }
    }

    if (pointer.props !== undefined) {
      pointer = pointer.props
    }
    if (pointer.items !== undefined) {
      pointer = pointer.items
    }
    // console.log(JSON.stringify(pointer,null,2))
    //alert(JSON.stringify(pointer,null,2))
    return pointer
  }

  handleMasterRemove = (path) => {

    if(window.confirm("Remove \"" + path[path.length-1] + "\" element?")){
      var {output} = this.state
      var pointer, info_pointer

      //pointer = output[path[0]]
      var i;

      if(path.length>2){
        pointer = output[path[0]]
        //length -2
        for (i = 1; i < path.length-2; i++) {
          pointer = pointer[path[i]]
        }
      } else {
        pointer = output
        i=0
      }

      //this.out(pointer)

      pointer[path[i]] = {...pointer[path[i]],[path[i+1]]:undefined}
      info_pointer = this.returnInfoForRemove(path)

      //passing through the oneOf level if it exists
      if(info_pointer._current_case !== undefined){
        if(info_pointer.casesNOA !== undefined){
          info_pointer = info_pointer.casesInfo[this.findTheCase(path,info_pointer.casesArrayItems)]
        }
        else{
          info_pointer = info_pointer.casesInfo[info_pointer._current_case]
        }
      }

      info_pointer[path[path.length-1]] = {...info_pointer[path[path.length-1]],removed:true}

      this.setState(() => ({output}))
    }
  }

//----------handle Restore----------

  handleMasterRestore = (path) => {

    //console.log(JSON.stringify(path))
    var {output} = this.state
    var pointer, info_pointer

    var i;

    if(path.length>2){
        pointer = output[path[0]]
        //length -2
        for (i = 1; i < path.length-2; i++) {
          pointer = pointer[path[i]]
        }
      } else {
        pointer = output
        i=0
      }

    info_pointer = this.returnInfoForRemove(path)
    //alert(JSON.stringify(info_pointer,null,2))

    //passing through the oneOf level if it exists
    if(info_pointer._current_case !== undefined){
      if(info_pointer.casesNOA !== undefined){
        info_pointer = info_pointer.casesInfo[this.findTheCase(path,info_pointer.casesArrayItems)]
      }
      else{
        info_pointer = info_pointer.casesInfo[info_pointer._current_case]
      }
    }

    //going one step further
    info_pointer = info_pointer[path[path.length-1]]

    //this.out(info_pointer)
    
    pointer[path[i]] = {...pointer[path[i]],[path[i+1]]:this.returnBasicType(info_pointer.type,info_pointer.values)}

    this.setState(() => ({output}))   
  }

  returnBasicType = (type,values) => {
    switch (type){
      case 'string':
        return ""

      case 'boolean':
        return false

      case 'object':
        return {}

      case 'enum':
        return values[0]

      case 'number':
        return 0

      default:
        throw new Error('type problem (type: '+type+') in "returnBasicType()" function')
    }
  }

//----------make The State----------

  returnNoObject(items,name) {
    var inner, innerInfo, items_template, items_values = undefined

    if(items===undefined){
      throw new Error(name);      
    }

    switch (items.type){
      case 'string':
        inner = ['']
        innerInfo = 'string'
        items_template= ''
        break;
      case 'object':
        inner = [{}]
        innerInfo = 'object'
        items_template= {}
        break;
      case 'number':
        inner = [0]
        innerInfo = 'number'
        items_template= 0
        break;
      case 'boolean':
        throw new Error('Array named: "' + name + '" has simple fields as items, so it is pointless for these items to be of type: "boolean"')
      case 'array':
        throw new Error('Array named: "' + name
          + '" cannot have items of type "array". If you need to have nested arrays use "object" typed "items" which may contain "properties" of type "array"')
      default:
        if(items.enum !== undefined){
          const val = items.enum
          inner = [val[0]]
          innerInfo = 'enum'
          items_template= val[0]
          items_values= val
        }
        else {
          throw new Error('Unsupported type: "'+ items.type + '" in items of array named: "' + name + '" of section: "' + this.props.sectionName + '"')
        }
        break;
    }

    return [inner, innerInfo, items_template, items_values]
  }

  //stuff = properties field
  //NOA = Number of Arrays
  returnFields(stuff,required,NOA) {
   
    var retState = {}
    var retInfo = {}
    var fixed = {name:'',desc:' ',cont:{}}
    var inner = []
    var innerInfo = {}
    var pr = {}
    var rets
    var req
    var tempInfo = {}
    var template
    var itemsValues
    var minItems
    var casesOut = [], casesInfo = [], casesDesc = [], casesTemplates = [], oneOf
    var i
    var tempDesc
    var casesArrayItems

    if(stuff==={}){
      throw new Error('empty')
    }

    // "entry" is [name,content]
    Object.entries(stuff).map( entry => {

      //For error demonstration purposes
      ///////////////////////////////////////////////////////
      if(entry[0]==='__t1'){
        retState = {...retState,t1:"rrr"}
      }
      ///////////////////////////////////////////////////////

      fixed.name=entry[0]

      //check if the field is required
      if (required === undefined) {
        req = false
      } else {
        req = required.includes(fixed.name)
      }

      //check if field is just {}
      if (JSON.stringify(entry[1]) === '{}'){
        retState = {...retState,[fixed.name]:{}}
        retInfo = {...retInfo,[fixed.name]:{type: 'object'}}
      }
      else {
        switch (entry[1].type){
          case 'string':
            //saving pattern or format props
            if(entry[1].pattern !== undefined){
              tempInfo={pattern:entry[1].pattern}
            } else if(entry[1].format !== undefined){
              tempInfo={format:entry[1].format}
            }
            fixed.cont=''
            fixed.desc=entry[1].description
            break;

          case 'array':

            //oneOf case
            if(entry[1].items===undefined){
              if(entry[1].oneOf===undefined){
                throw new Error('Found no "items" or "oneOf" property in array: "' + entry[0] + '" of section: "' + this.props.sectionName + '"')
              }

              //emptying...
              inner = {}
              casesOut = []
              casesInfo = []
              casesDesc = []
              casesTemplates = []

              oneOf = entry[1].oneOf

              for(i=0;i<oneOf.length;i++){
                pr = oneOf[i].items.properties
                //rets = this.returnFields(oneOf[i].items.properties,oneOf[i].required)
                if (pr !== undefined){
                  rets = this.returnFields(pr,oneOf[i].items.required,NOA+1)
                }
                else {
                  [inner,innerInfo,template,itemsValues] = this.returnNoObject(oneOf[i].items,fixed.name)
                  rets[0] = JSON.parse(JSON.stringify(inner).slice(1,-1))
                  rets[1] = {_type:innerInfo,items_desc:oneOf[i].items.description,items_template:template,items_values:itemsValues}
                }
                casesOut = [...casesOut,[rets[0]]]
                casesInfo = [...casesInfo,rets[1]]
                tempDesc = oneOf[i].description
                if (tempDesc==null){tempDesc=' '}
                casesDesc = [...casesDesc,tempDesc]

                template = JSON.parse(JSON.stringify(rets[0]))
                casesTemplates = [...casesTemplates,template]
              }

              inner = casesOut[0]
              fixed.desc=entry[1].description
              tempInfo = {type:'array_oneOf',
                          _current_case:0,
                          casesOut:casesOut,
                          casesInfo:casesInfo,
                          casesDesc:casesDesc,
                          casesTemplates:casesTemplates,
                          minItems:entry[1].minItems
                          }
              if(NOA>0){
                casesArrayItems = [0]
                for(i=2;i<=NOA;i++){
                  casesArrayItems = [casesArrayItems]
                }
                tempInfo = {casesNOA:NOA,casesArrayItems:casesArrayItems,...tempInfo/*,_current_case:-1*/}
              }
            }
            else {
              pr = entry[1].items.properties
              inner = []
              if (pr !== undefined){
                rets = this.returnFields(pr,entry[1].items.required,NOA+1)
                inner = [rets[0]]
                innerInfo = rets[1]

                //parsing the stringified object will make a new copy
                //otherwise "template" will be a pointer to the object in this.state
                //thus "items_template" prop will change with every state change
                template = JSON.parse(JSON.stringify(inner[0]))
                tempInfo = {items:innerInfo,items_template:template}       
              }
              else {
                if(entry[1].items.oneOf!== undefined){
                  throw new Error('Found "oneOf" as a property of "items" in: "'+ entry[0]+'" of section: "' + this.props.sectionName + '". It should be the other way round (rule_10).')
                }
                else {

                  [inner,innerInfo,template,itemsValues] = this.returnNoObject(entry[1].items,fixed.name)
                  const itemsDesc = entry[1].items.description

                  tempInfo = {items:innerInfo,items_desc:itemsDesc,items_template:template,items_values:itemsValues}
                }
              }
            }
            fixed.cont=inner
            fixed.desc=entry[1].description

            break;

          case 'object':
            pr = entry[1].properties
            inner = []
            if (pr !== undefined){
              rets = this.returnFields(pr,entry[1].required,NOA)
              inner = rets[0]
              innerInfo = rets[1]

              fixed.desc=entry[1].description
              tempInfo = {props:innerInfo}
            }
            else {
              //emptying...
              inner = {}
              casesOut = []
              casesInfo = []
              casesDesc = []
              fixed.desc=entry[1].description

              //oneOf
              if(entry[1].oneOf !== undefined){
                oneOf = entry[1].oneOf
                for(i=0;i<oneOf.length;i++){
                  rets = this.returnFields(oneOf[i].properties,oneOf[i].required,NOA)
                  casesOut = [...casesOut,rets[0]]
                  casesInfo = [...casesInfo,rets[1]]
                  tempDesc = oneOf[i].description
                  if (tempDesc==null){tempDesc=' '}
                  casesDesc = [...casesDesc,tempDesc]
                }
                inner = casesOut[0]
                fixed.desc=entry[1].description
                tempInfo = {type:'object_oneOf',
                            _current_case:0,
                            casesOut:casesOut,
                            casesInfo:casesInfo,
                            casesDesc:casesDesc
                            }
                if(NOA>0){
                  casesArrayItems = [0]
                  for(i=2;i<=NOA;i++){
                    casesArrayItems = [casesArrayItems]
                  }
                  tempInfo = {casesNOA:NOA,casesArrayItems:casesArrayItems,...tempInfo/*,_current_case:-1*/}
                }
              }
              else if(entry[1].required !== undefined){
                //throw new Error('Found no "properties" of "oneOf" property in element: "' + entry[0] + '" of section: "' + this.props.sectionName + '"')
                throw new Error('Found no "properties" in "object" element: "' + entry[0] + '" of section: "' + this.props.sectionName + '"')
              }
            }
            fixed.cont=inner
            break;

          case 'boolean':
            fixed.cont = false
            fixed.desc = entry[1].description
            break;

          case 'number':
            fixed.cont = 0
            fixed.desc = entry[1].description
            break;

          default: 
            if(entry[1].enum !== undefined) {
              const val = entry[1].enum
              fixed.cont = val[0]

              fixed.desc=entry[1].description
              tempInfo = {type:'enum',values:entry[1].enum}
            } else {
              throw new Error('Unsupported type: "'+ entry[1].type + '" in field named: "' + entry[0] + '" of section: "' + this.props.sectionName + '"')
            }
            break;  
        }

        //this is for rendering a whitespace and thus keeping the same
        //spaces between this element and the one directly below it
        if (fixed.desc === undefined) {
          fixed.desc = ' '
        }

        //if minItems = undefined it will be ignored
        minItems = entry[1].minItems

        tempInfo = {desc: fixed.desc, req:req, minItems: minItems, type: entry[1].type,...tempInfo}

        retState = {...retState,[fixed.name]:fixed.cont}
        retInfo = {...retInfo,[fixed.name]:tempInfo}

        tempInfo={}//emptying tempInfo to avoid old values overwriting the new ones
      }

      //this is only for the worning to go away. The .map(()=>{"sould return something here"})
      return null
    })

    return [retState,retInfo]
  }

  returnHeadField = ([propName,content],required) => {

    var ret = [null,null]

    //by rule_7: "all head properties of a section are asumed as required"
    //otherwise we do:
    //const req = required.includes(propName)

    //alert(JSON.stringify(required,null,2))

    if (content.enum !== undefined) {
      ret = [content.enum[0],{type:'enum',values:content.enum,req:true}]
    } else {
        var stateValue
        switch (content.type){
          case 'string':
            stateValue = ''
            break;
          case 'boolean':
            stateValue = false
            break;
          case 'number':
            stateValue = 0
            break;
          case 'object':
            stateValue = {}
            break;
          default:
            if(Object.keys(content).length===0){
              return [{},{type:'object',req:true}]
            }else{
              throw new Error('Unsupported type: "'+ content.type + '" in field named: "' + propName + '" of section: "' + this.props.sectionName + '"')
            }
        }

      ret = [stateValue,{type:content.type,req:true}]
    }

    return ret
  }

  makeTheState = () => {
    if (!this.props.masterState.isSet){
      try{
        var {properties} = this.props.jsonSection
        const {type} = this.props.jsonSection
        if(type===undefined){
          throw new Error('Missing "type" property in "'+this.props.sectionName+'"')
        }

        var {items} = this.props.jsonSection
        if(properties===undefined && items === undefined){

          if(this.props.jsonSection.oneOf === undefined){
            const keys = Object.keys(this.props.jsonSection)
            if(keys.includes('allOf')){
              throw new Error('"'+this.props.sectionName+'" section has "allOf" property which is not supported(Rule_8). Please arrange your Input Schema differently')
            } else if(keys.includes('anyOf')){
              throw new Error('"'+this.props.sectionName+'" section has "anyOf" property which is not supported(Rule_8). Please arrange your Input Schema differently')
            } else {
              throw new Error('No "properties" or "oneOf" property in "'+this.props.sectionName+'" section');
            }
          }

          var topLevel = []
          var i
          const {oneOf} = this.props.jsonSection

          if(oneOf.length === 0 || oneOf.length === undefined){
            throw new Error('"'+this.props.sectionName+'" section has an "oneOf" property which is not an array or an empty one')
          }

          for(i=0;i<oneOf.length;i++){
            properties = oneOf[i].properties
            if(Object.keys(properties).length === 0){
              throw new Error('Item ' + i + ' of "oneOf" property of section "'+this.props.sectionName+'" has an empty "{}" "properties" property')
            }
            if(properties === undefined){
              throw new Error('Item ' + i + ' of "oneOf" property of section "'+this.props.sectionName+'" is missing a "properties" property')
            }
            topLevel = [...topLevel,this.makeTopLevel(properties)]
          }
          return {oneOf:[...topLevel],...topLevel[0]}
        }
        else if(properties!==undefined){
          return this.makeTopLevel(properties)
        }
        //array section
        else{
          properties = this.props.jsonSection.items.properties
          var {required} = this.props.jsonSection.items
          if (required === undefined) {required=[]}

          const rets = this.returnFields(properties,required,1)
          return {
            minimum_Items:this.props.jsonSection.minItems,
            isSet:true,
            arraySection:true,
            info_lowerOneOfs: [],
            output:[rets[0]],
            info:rets[1],
            template:JSON.parse(JSON.stringify(rets[0]))
          }
        }
      }catch(err){
        alert(err)
        this.props.setGOflag(false)
        this.props.setCheckFlag(false)
        this.props.setActiveStep(0)
        //err.toString() might throw an error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.props.setErrorList(err.toString())
      }
    }
  }

  makeTopLevel = (properties,isArraySection) => {
    try{
      var stuff, required, rets
      var oldout, oldInfo
      var newinfo_Arrays = []
      var newinfo_Desc = {}
      var newheadTemplates = {}
      var newminimumItems = {}

      var entries_array = Object.entries(properties)
      const parentRequired = this.props.jsonSection.required
      var i,property;
      var template

      var casesInfo = []
      var casesOut = []
      var tempDesc
      var casesDesc = []
      var casesTemplates = []
      var j

      for (i=0;i<entries_array.length;i++){

        //property[0] -> name, property[1] -> content
        property = entries_array[i]

        //Saving the description of the head objects and arrays
        newinfo_Desc = {...newinfo_Desc,[property[0]]:property[1].description}

        //Head Prop is array
        if (property[1].type === 'array'){
          newinfo_Arrays = [...newinfo_Arrays,property[0]]

          //oneOf case for "array"
          if(property[1].oneOf !== undefined){
            const {oneOf} = property[1]
            casesInfo = []
            casesOut = []
            tempDesc = ' '
            casesDesc = []
            casesTemplates = []

            for(j=0;j<oneOf.length;j++){
              if(oneOf[j].items===undefined){
                throw new Error('Missing "items" property in item: '+ j +' of "oneOf" property of array: "' + property[0] + '" of section: "' + this.props.sectionName + '"')
              }
              stuff = oneOf[j].items.properties
              if(stuff!==undefined){
                required = oneOf[j].items.required

                rets = this.returnFields(stuff,required,1)
                casesOut = [...casesOut,[rets[0]]]//  brackets 
                casesInfo = [...casesInfo,rets[1]]

                template = JSON.parse(JSON.stringify(rets[0]))
                casesTemplates = [...casesTemplates,template]
              }
              else{
                if(oneOf[j].items.required !== undefined){
                  throw new Error('Missing "properties" in "items" property of item: '+ j +' of "oneOf" property of array: "' + property[0] + '" of section: "' + this.props.sectionName + '"')
                }
                const [inner,innerInfo,innerTemplate] = this.returnNoObject(oneOf[j].items,property[0])
                casesOut = [...casesOut,inner]
                casesInfo = [...casesInfo,{_type:innerInfo,
                                           items_desc:oneOf[j].items.description,
                                           pattern:oneOf[j].items.pattern,
                                           format:oneOf[j].items.format,
                                           values:oneOf[j].items.enum}]
                template = JSON.parse(JSON.stringify(innerTemplate))
                casesTemplates = [...casesTemplates,template]
              }
              tempDesc = oneOf[j].description
              if (tempDesc==null){tempDesc=' '}
              casesDesc = [...casesDesc,tempDesc]
            }

            oldout = {...oldout,[property[0]]:casesOut[0]}
            oldInfo = {...oldInfo,
                        [property[0]]:{
                          _current_case:0,//it must be the first field!!!
                          //type:'array',
                          casesOut:casesOut,
                          casesInfo:casesInfo,
                          casesDesc:casesDesc,
                          casesTemplates:casesTemplates
                        }
                      }
            template = JSON.parse(JSON.stringify(casesOut[0]).slice(1,-1))
            newheadTemplates = {...newheadTemplates,[property[0]]:template}
            newminimumItems = {...newminimumItems,[property[0]]:property[1].minItems}

          }
          //normal case for "array"
          else {
            if(property[1].items===undefined){
              throw new Error('Missing "items" or "oneOf" property in array: "' + property[0] + '" of section: "' + this.props.sectionName + '"')
            }          
            stuff = property[1].items.properties
            if(stuff!==undefined){
              required = property[1].items.required

              rets = this.returnFields(stuff,required,1)
              oldout = {...oldout,[property[0]]:[rets[0]]}//ret has brackets!!!
              oldInfo = {...oldInfo,[property[0]]:rets[1]}

              template = JSON.parse(JSON.stringify(rets[0]))
              newheadTemplates = {...newheadTemplates,[property[0]]:template}
              newminimumItems = {...newminimumItems,[property[0]]:property[1].minItems}
            }
            else {
              if(property[1].items.required !== undefined){
                throw new Error('Missing "properties" in items property of array: "' + property[0] + '" of section: "' + this.props.sectionName + '"')
              }
              const [inner,innerInfo,innerTemplate] = this.returnNoObject(property[1].items,property[0])
              oldout = {...oldout,[property[0]]:inner}//no brackets!!!
              oldInfo = {...oldInfo,
                        [property[0]]:{_type:innerInfo,
                                       items_desc:property[1].items.description,
                                       pattern:property[1].items.pattern,
                                       format:property[1].items.format,
                                       values:property[1].items.enum
                                      }
                        }

              template = JSON.parse(JSON.stringify(innerTemplate))
              newheadTemplates = {...newheadTemplates,[property[0]]:template}
              newminimumItems = {...newminimumItems,[property[0]]:property[1].minItems}
            }
          }
        }
        //Head Prop is object
        else if (property[1].type === 'object') {

          //oneOf case for "object"
          if(property[1].oneOf !== undefined){
            const {oneOf} = property[1]
            casesInfo = []
            casesOut = []
            tempDesc = ''
            casesDesc = []
            for(j=0;j<oneOf.length;j++){
              stuff=oneOf[j].properties
              if(stuff!==undefined){
                required = oneOf[j].required
                
                rets = this.returnFields(stuff,required,0)
                casesOut = [...casesOut,rets[0]]
                casesInfo = [...casesInfo,rets[1]]
                tempDesc = oneOf[j].description
                if (tempDesc==null){tempDesc=' '}
                casesDesc = [...casesDesc,tempDesc]
              } else {
                throw new Error('Missing "properties" property in item: '+ j +' of "oneOf" property of element: "' + property[0] + '"(type: "object") of section: "' + this.props.sectionName + '".' +
                  '\nIf this is on purpose please consider "rule_11"')
              }
            }
            oldout = {...oldout,[property[0]]:casesOut[0]}
            oldInfo = {...oldInfo,
                        [property[0]]:{
                          _current_case:0,//it must be the first field!!!
                          //type:'object',
                          casesOut:casesOut,
                          casesInfo:casesInfo,
                          casesDesc:casesDesc
                        }
                      }          
          }
          //normal case for "object"
          else {

            stuff = property[1].properties
            if(stuff!==undefined){
              required = property[1].required
              
              rets = this.returnFields(stuff,required,0)
              oldout = {...oldout,[property[0]]:rets[0]}
              oldInfo = {...oldInfo,[property[0]]:rets[1]}
            } else {
              
              if(property[1].required !== undefined){
                throw new Error('Missing "properties" property in element: "' + property[0] + '" of section: "' + this.props.sectionName + '"')
              }
              rets = this.returnHeadField(property,parentRequired)
              oldout = {...oldout,[property[0]]:rets[0]}
              oldInfo = {...oldInfo,[property[0]]:rets[1]}
            }
          }
        }
        //Head Prop is a simple field
        else {
          rets = this.returnHeadField(property,parentRequired)
          oldout = {...oldout,[property[0]]:rets[0]}
          oldInfo = {...oldInfo,[property[0]]:{...rets[1],
                                                pattern:property[1].pattern,
                                                format:property[1].format
                                              }
                    }
        }
      }

      //this.out(oldout)
      //this.out(oldInfo)

      return {
        output: oldout,
        info: oldInfo,
        isSet:true,
        info_Arrays:newinfo_Arrays,
        info_Desc:newinfo_Desc,
        head_Templates:newheadTemplates,
        minimum_Items:newminimumItems,
        head_lowerOneOfs:{}
      }
    }catch(err){
      alert(err)
      this.props.setGOflag(false)
      this.props.setCheckFlag(false)
      this.props.setActiveStep(0)
      //err.toString() might throw an error!
      this.props.setErrorList(err.toString())
    }
  }

//-----------Case Clicked-----------

  sectionCaseClicked = (index) => {
    this.setState( prevState => ({
      current:0,
      current2:-1,
      current_oneOf:index,
      ...prevState.oneOf[index]
    }))
  }

  masterCaseClicked = (index,path) => {
    //Calling "returnInfoForRemove" because it returns the desired pointer,
    //even though we do not need to remove anything
    var pointer_info = this.returnInfoForRemove(path,true) 
    //console.log(JSON.stringify(pointer_info,null,2))
    var {_current_case} = pointer_info

    var i, pointer
    var {output} = this.state

    //alert(JSON.stringify(pointer_info,null,2))
    //this.out(pointer_info)
    //console.log(JSON.stringify(path))


    if(typeof path[0] === 'number'){
      //alert("we have an array section")
      // console.log(JSON.stringify(pointer_info,null,2))
      pointer = output[path[0]]
      //console.log(JSON.stringify(pointer,null,2))

      for (i = 1; i < path.length-1; i++) {
        pointer = pointer[path[i]]
        // console.log(JSON.stringify(pointer,null,2))

      }
      // console.log("This is the pointer")
      // console.log(JSON.stringify(pointer,null,2))

      if(path.length > 2){
        //+ one step
        pointer_info = pointer_info[path[path.length-1]]
      }

      pointer[path[i]] = deepCopy(pointer_info.casesOut[index])
      pointer_info._current_case = index
      this.changeArrayCases(path,pointer_info.casesArrayItems,index)
      this.informUpperArray(path)

      this.setState(() => ({output}))
    }
    else{
      if (path.length === 1) {
        output[path[0]] = pointer_info.casesOut[index]
        pointer_info._current_case = index
        this.setState(() => ({output}))
      }
      //Array Head Prop
      else if(path.length === 2 && typeof path[1] === 'number'){
        pointer_info.casesOut[_current_case] = output[path[0]]
        output[path[0]] = pointer_info.casesOut[index]

        const head_Templates = {
          ...this.state.head_Templates,
          [path[0]]:pointer_info.casesTemplates[index]
        }

        pointer_info._current_case = index
        this.setState(() => ({
          output,
          head_Templates,
          current2: -1
        }))
      }
      else {
        pointer_info = pointer_info[path[path.length-1]]
        _current_case = pointer_info._current_case
        //alert(JSON.stringify(pointer_info,null,2))
        pointer = output[path[0]]
        for (i = 1; i < path.length-1; i++) {
          pointer = pointer[path[i]]
        }

        if(pointer_info.casesNOA === undefined){
          pointer_info.casesOut[_current_case] = pointer[path[i]]
        }

        pointer[path[i]] = deepCopy(pointer_info.casesOut[index])
        pointer_info._current_case = index

        if(pointer_info.casesNOA>0){
          this.changeArrayCases(path,pointer_info.casesArrayItems,index)
          this.informUpperArray(path)
        }

        this.setState(() => ({output}))
      }
    }
  }

  informUpperArray = (path) => {
    const {info} = this.state

    var pointer = info[path[0]]
    var i,p,isInformed,denumberedPath,pointer2;

    denumberedPath = path.map(t => (typeof t === 'number'?'_num_':t))

    var isArraySection = typeof path[0] === 'number'
    if(isArraySection){
      pointer = info[path[1]]
      pointer2 = this.state

      isInformed = pointer2.info_lowerOneOfs.some(item => (
          JSON.stringify(item)===JSON.stringify(denumberedPath)
        ))

      if(!isInformed){
        pointer2.info_lowerOneOfs = [...pointer2.info_lowerOneOfs,JSON.parse(JSON.stringify(denumberedPath))]
      }
    }

    //checking if there is a HeadArray property
    if(typeof path[1] === 'number'){
      pointer2 = this.state
    
      if(pointer2.head_lowerOneOfs[path[0]]!==undefined){
        isInformed = pointer2.head_lowerOneOfs[path[0]].some(item => (
          JSON.stringify(item)===JSON.stringify(denumberedPath)
        ))
        if(!isInformed){
          pointer2.head_lowerOneOfs[path[0]] = [...pointer2.head_lowerOneOfs[path[0]],JSON.parse(JSON.stringify(denumberedPath))]
        }
      }
      else{
        pointer2.head_lowerOneOfs[path[0]] = [JSON.parse(JSON.stringify(denumberedPath))]
      }
    }

    for (i = 1; i < path.length; i++) {
      //in case of an Array Section, path[0] and path[1] have been taken care of
      if(i===1 && isArraySection) {continue;}

      p = path[i]

      if(pointer._current_case !== undefined){
        pointer = pointer.casesInfo[pointer._current_case]
      }
      
      if (pointer.props !== undefined) {
        pointer = pointer.props
      }

      if (typeof p == 'number') {
        //ignore first index in case of array head_property
        //or skipping problematic case of not having "items" property
        //in "info" when using "casesInfo"
        if(i===1 || pointer.items===undefined) {continue;}

        if(pointer.lowerOneOfs!==undefined){
          isInformed = pointer.lowerOneOfs.some(item => (
            JSON.stringify(item)===JSON.stringify(denumberedPath)
          ))
          if(!isInformed){
            pointer.lowerOneOfs = [...pointer.lowerOneOfs,JSON.parse(JSON.stringify(denumberedPath))]
          }
        }
        else{
          pointer.lowerOneOfs = [JSON.parse(JSON.stringify(denumberedPath))]
        }
        pointer = pointer.items
        
      }
      else {
        pointer = pointer[p]
      }
      if (pointer.type === 'object'){
        pointer = pointer.props
      }
    }
  }

  changeArrayCases = (path,casesArrayItems,index) =>{
    var i,temp,pointer = casesArrayItems

    const arrayPath = path.filter(function (item) {
      return (parseInt(item) === item);
    })
    for(i=0;i<arrayPath.length-1;i++){
      if(pointer[arrayPath[i]]===undefined){
        if(i===arrayPath.length-2){
          temp = new Array(arrayPath[i+1]+1).fill(0);
        }
        else{
          temp = []
        }
        pointer[arrayPath[i]]=JSON.parse(JSON.stringify(temp))
      }
      pointer = pointer[arrayPath[i]]
    }

    pointer[arrayPath[i]] = index
  }

  findTheCase = (path,casesArrayItems,limit) => {
    var i,pointer = casesArrayItems
    var trueLimit = (limit !== undefined?limit:path.length)
    for(i=0;i<trueLimit;i++){
      if(typeof path[i] === 'number'){
        pointer = pointer[path[i]]
      }
      if(pointer === undefined){
        return 0
      }
    }
    return pointer
  }

//-------------Controls-------------

  returnControlButtons = () => {
    const { classes , sectionNo } = this.props
    const { sections } = this.state

    return (
      <ControlButtons
        classes={classes}
        sections={sections}
        sectionNo={sectionNo}
        state={this.state}
        handleBack={this.props.handleBack}
        handleNext={this.props.handleNext}
        homeButton={this.props.homeButton}
      />
    )
  }

//-----------Error Remove-----------

  errorRemove = (path) => {
    const {output} = this.state
    delete output[path[0]]
    this.out(this.state)
    this.setState((prevState)=> ({
      current:prevState.prevCurrent,
      output
    }))
  }

//----------------------------------

  render () {

    try{
      const name = this.state.sections[this.props.sectionNo]
      const description = this.props.jsonSection.description

      var {properties} = this.props.jsonSection
      var topDesc = this.props.jsonSection.description

      if(this.state.oneOf !== undefined){
        properties = this.props.jsonSection.oneOf[this.state.current_oneOf].properties
        topDesc = this.props.jsonSection.oneOf[this.state.current_oneOf].description
        return (
          <>
            {this.returnControlButtons()}
            <MainTitle
              name={name}
              description={description}
            />
            <Grid container spacing={3} style={{backgroundColor: '#f5f5f5'}}>
              <Grid item xs={4}>
                <Typography variant='subtitle1' align='center'>
                  <i>Please choose a case for "{name}":</i>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Grid container spacing={1}>
                  {this.state.oneOf.map((item,index) => (
                    <Grid key={index} item xs={12} sm={3}>
                      <Button
                        variant='contained'
                        disabled={index === this.state.current_oneOf}
                        color={index !== this.state.current_oneOf?'primary':'default'}
                        align='left'
                        onClick={() => this.sectionCaseClicked(index)}
                      >
                        case {index}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant='subtitle1' align='center'>
                  "{topDesc}"
                </Typography>
              </Grid>
            </Grid>
            {this.returnPage(properties)}
            {this.returnControlButtons()}
          </>
        )
      }
      else if(this.state.arraySection){
        return (
          <>
            {this.returnControlButtons()}
            <MainTitle
              name={name}
              description={topDesc}
            />
            {this.returnPage(properties,this.state.output)}
            {this.returnControlButtons()}
          </>
        )
      }
      else {
        return (
          <>
            {this.returnControlButtons()}
            <MainTitle
              name={name}
              description={topDesc}
            />
            {this.returnPage(properties)}
            {this.returnControlButtons()}
          </>
        )
      }

    }catch(err){
      alert(err)
      this.props.setGOflag(false)
      this.props.setCheckFlag(false)
      this.props.setActiveStep(0)
      return null
    }
  }

  returnPage = (properties,items) => {
    const { classes , sectionNo } = this.props
    const { sections, current, current2, arraySection} = this.state

    const HPR = Object.keys(this.state.output)

    return (
      //we use key here, otherwise it wont change sections when cklicking the menu
      <React.Fragment key={this.props.sectionNo}>
        <CssBaseline key='CssBaseline'/>
        <MenuBar
          key={"menu"}
          classes={classes}
          sections={sections}
          sectionNo={sectionNo}
          menuClicked={this.menuClicked}
        />

        {!arraySection?
          <>
            <MyDrawer
              classes={classes}
              drawerItems={HPR}
              current={current}
              current2={current2}
              infoArrays={this.state.info_Arrays}
              onItemClick={this.handleDrowerClick}
              name={Object.keys(this.state.output)[current]}
              subData={Object.values(this.state.output)[current]}
              subInfo={Object.values(this.state.info)[current]}
              onSubNew={this.handleHeadNew}
              onSubItemClick={this.handleSubDrowerClick}
              returnItemContents={this.returnItemContents}
            />

            <main className={clsx(classes.content)}>
              <Grid container spacing={4}>
                {this.doTheRest(this.state.current)}
              </Grid>
              <br />
              <br />  
            </main>
          </>
          :
          <>
            <MyArrayDrawer
              classes={classes}
              drawerItems={items}
              current={current}
              onItemClick={this.handleDrowerClick}
              onNewTopItem={this.handleArraySectionNew}
              returnItemContents={this.returnItemContents}
            />
            <main className={clsx(classes.content)}>
              <Grid container spacing={4}>
                {this.doTheRestArraySection()}
              </Grid>
              <br />
              <br />  
            </main>
          </>
        }
        <br/> 
        <br/> 
        <Grid container spacing={4}>       
          <Grid item xs={12} sm={12}>
            {/*<Button
              variant='contained'
              color='primary'
              align='left'
              onClick={this.handleLogSend}
              className={classes.buttonMain}
            >
              Log State
            </Button>
            <Button
              variant='contained'
              color='primary'
              align='left'
              onClick={this.handleLogInfo}
              className={classes.buttonMain}
            >
              Log Info
            </Button>*/}
            <Button
              variant='contained'
              color='primary'
              onClick={() => this.props.handleOutputFile(this.state,this.props.sectionNo)}
              className={classes.buttonMain}
            >
              Output File
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    )   
  }
}

export default withStyles(useStyles)(Section)
