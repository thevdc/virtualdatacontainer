import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Section from './Section'

import Toolbar from '@material-ui/core/Toolbar'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import jsonData from '../data/Artifact Schema.json'

import { writeTab } from './useful_functions/writeTab'
import { homeOutputFile } from './home_functions/homeOutputFile'
import { homeCheckRequired } from './home_functions/homeCheckRequired'
import { ShowTheRules, ShowHelp } from './home_functions/HomeShowRulesAndHelp'

function Copyright () {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      <Link
        color='inherit'
        rel='noopener noreferrer'
        href='https://thevdc.github.io/virtualdatacontainer/'
        target='_blank'
      >
        Virtual Data Container
      </Link>

      {' - Artifact Editor © '}
      <Link
        color='inherit'
        rel='noopener noreferrer'
        href='https://www.linkedin.com/in/minas-alvertis-613839207/'
        target='_blank'
      >
        Minas Alvertis
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const drawerWidth = 280
const drawerItems = ['Input Schema', 'Rules', 'Help & Tips']

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    color: 'white'
  },
  layout: {
    marginTop: 100,
    marginLeft: drawerWidth + theme.spacing(5),
    marginRight: theme.spacing(5)
  },
  drawer: {
    width: 300, // drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: 'transparent'
  },
  drawerContainer: {
    overflow: 'auto',
    backgroundColor: 'transparent'
  },
  listItemText: {
    maxWidth: 260
  },
  paper: {
    backgroundColor: 'transparent',
    minHeight: '75vh',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    backgroundColor: '#d9ddf2',

    '&:hover': {
      background: '#b4bbe4'
    }
    // fontFamily: "Times New Roman"
  },
  buttonMain: {
    fontWeight: 'bold',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
}))

// ----------States-----------

var SectionDefaultState = {
  sections: [],
  prevCurrent: 0,
  current: 0,
  current2: 0,
  current_oneOf: 0,
  isSet: false,
  divider1: '#####################################################################',
  output: {},
  divider2: '#####################################################################'
}

// ----------------------------------

export default function Checkout () {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [masterInput, setMasterInput] = React.useState(/* dummyInput */)
  const [json, setJson] = React.useState()
  const [GOflag, setGOflag] = React.useState(false)
  const [drawerCurrent, setDrawerCurrent] = React.useState(0)
  const [checkFlag, setCheckFlag] = React.useState(false) // Flag for error checking
  const [errorList, setErrorList] = React.useState('')
  const [fileName, setFileName] = React.useState('')

  const [masterStates, setMasterStates] = React.useState([])
  var ref = useRef()

  // ------handle Section changes------

  const handleNext = (lowerState, index) => {
    const temp = [...masterStates]
    temp[activeStep] = lowerState
    setMasterStates(temp)
    setActiveStep(activeStep + 1)
  }

  const handleBack = (lowerState, index) => {
    const temp = [...masterStates]
    temp[activeStep] = lowerState
    setMasterStates(temp)
    setActiveStep(activeStep - 1)
  }

  const menuClicked = (lowerState, index) => {
    if (activeStep !== index) {
      const temp = [...masterStates]
      temp[activeStep] = lowerState
      setMasterStates(temp)
      setActiveStep(index)
    }
  }

  // ----------------------------------

  function checkForErrors (NoOfSections) {
    const delay = 100
    if (activeStep !== NoOfSections - 1) {
      setTimeout(() => {
        setActiveStep(activeStep + 1)
      }, delay)
    } else {
      setTimeout(() => {
        setActiveStep(0)
        // if the error is on the last section, the alert message will still say "Input is OK!"
        // alert('Input is OK!')
      }, delay)
      setCheckFlag(true)
    }
  }

  function getSection (step) {
    return <Section
      key={step}
      sectionNo={step}
      sectionName={masterStates[step].sections[step]}
      jsonSection={(Object.entries(json.properties)[step])[1]}
      menuClicked={menuClicked}
      masterState={masterStates[step]}
      setGOflag={setGOflag}
      setCheckFlag={setCheckFlag}
      setActiveStep={setActiveStep}
      setErrorList={setErrorList}
      homeButton={homeButton}
      handleNext={handleNext}
      handleBack={handleBack}
      handleOutputFile={handleOutputFile}
           />
  }

  function defaultInput () {
    setMasterInput(JSON.stringify(jsonData, null, '\t'))
    setFileName('Artifact Schema.json')
    setErrorList('')
  }

  function parseJSON () {
    try {
      setJson(JSON.parse(masterInput))
    } catch (err) {
      alert(err)
      setErrorList(err.toString())
    }
  }

  // Skipping first useEffect
  // Initializing didMount as false
  const [didMount, setDidMount] = useState(false)

  // Setting didMount to true upon mounting
  useEffect(() => setDidMount(true), []) // [] so it runs only once

  // Now that we have a variable that tells us wether or not the component has
  // mounted we can change the behavior of the other effect based on that
  useEffect(() => {
    if (didMount) {
      // calling "doTheSections()" when json gets a new parsed value
      doTheSections()
    }
  }, [json])

  function doTheSections () {
    const sections = json.properties
    if (typeof sections === 'undefined') {
      const message = 'Input is missing main "properties" field'
      alert(message)
      setErrorList(message)
    } else {
      SectionDefaultState.sections = Object.keys(sections)

      const temp = []
      var i
      const { length } = SectionDefaultState.sections
      for (i = 0; i < length; i++) {
        temp[i] = JSON.parse(JSON.stringify(SectionDefaultState))
      }

      setActiveStep(0)
      setMasterStates(temp)
      setGOflag(true)
    }
  }

  function doTheDrawer () {
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
                style={index === drawerCurrent ? { backgroundColor: '#d9ddf2'/* 'lightgray' */ } : {}}
                button
                key={item}
                onClick={() => setDrawerCurrent(index)}
              >
                <ListItemText
                  primary={
                    <Typography noWrap>
                      <b>{(index === drawerCurrent ? '> ' : '') + item}</b>
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            <Divider />
            <ListItem
              key='error'
              style={{ color: 'red' }}
            >
              <ListItemText primary={errorList} />
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>
    )
  }

  function showDrawerContents () {
    switch (drawerCurrent) {
      case 0:
        return inputSchema()

      case 1:
        return <ShowTheRules />

      case 2:
        return <ShowHelp />

      default:
        throw new Error('problem with the step of Home Page drawer')
    }
  }

  function homeButton () {
    if (window.confirm('This action will take you to the Home screen and any input in the fields of the form will be lost! Continue?')) {
      setGOflag(false)
      setCheckFlag(false)
      setActiveStep(0)
      setErrorList('')
    }
  }

  const [cursorPos, setCursorPos] = React.useState('')

  function getCursorPosition (ref) {
    const subS = ref.value.substr(0, ref.selectionStart)
    const spl = subS.split('\n')
    const col = (spl[spl.length - 1]).length
    const row = subS.split('\n').length
    setCursorPos(row + ':' + col)
    return false
  }

  function inputSchema () {
    return (
      <Grid container>
        <Grid item xs={12} sm={12}>
          <TextField
            id='filled-multiline-flexible'
            label='Input Schema'
            multiline
            rowsMax={25}
            rows={25}
            variant='outlined'
            value={masterInput}
            onChange={e => setMasterInput(e.target.value)}// dynamic update when using useState
            inputRef={el => ref = el}
            onKeyDown={(e) => {
              writeTab(e, ref)
              setMasterInput(e.target.value)
            }}
            onKeyUp={(e) => { getCursorPosition(ref) }}
            onMouseUp={() => getCursorPosition(ref)}
            fullWidth
            helperText={'cursor at: ' + cursorPos}
          />
        </Grid>
        <Grid item xs={12} sm={12} align='right'>
          <div>
            {printFileName()}
          </div>
          <input
            accept='.json'
            className={classes.input}
            style={{ display: 'none' }}
            id='raised-button-file'
            type='file'
            onChange={(e) => handleFileChange(e)}
          />
          <label htmlFor='raised-button-file'>
            <Button
              variant='contained'
              component='span'
              className={classes.button}
            >
              Upload
            </Button>
          </label>
          <Button
            variant='contained'
            onClick={defaultInput}
            className={classes.button}
          >
            Default Input
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={parseJSON}
            className={classes.buttonMain}
          >
            Generate
          </Button>
        </Grid>
      </Grid>
    )
  }

  function printFileName () {
    if (fileName === '') {
      return 'No file loaded'
    } else {
      return fileName
    }
  }

  function handleFileChange (e) {
    const files = e.target.files
    const reader = new FileReader()
    reader.readAsText(files[0])

    reader.onload = (e) => {
      setMasterInput(e.target.result)
      setFileName(files[0].name)
    }
  }

  const [doTheOutputFile, setDoTheOutputFile] = React.useState(null)

  useEffect(() => {
    if (doTheOutputFile) {
      const emptyReqList = homeCheckRequired(masterStates)
      if (emptyReqList.length === 0) {
        homeOutputFile(masterStates)
      } else if (window.confirm('There are required fields that are empty.\nContinue anyway?\n\n' +
            printTheList(emptyReqList))) {
        homeOutputFile(masterStates)
      }
      // resetting the flag in order for the output button to work again
      setDoTheOutputFile(false)
    }
  }, [doTheOutputFile])

  function printTheList (list) {
    var stringList = ''
    list.map(item => {
      if (typeof item === 'string') {
        stringList = stringList + item + '\n'
      } else {
        stringList = stringList + printTheList(item)
      }
      return null // necessary for the map fuction
    })
    return stringList
  }

  function handleOutputFile (lowerState, index) {
    const temp = [...masterStates]
    temp[activeStep] = lowerState
    setMasterStates(temp)
    setTimeout(() => {
      setDoTheOutputFile(true)
    }, 100)
  }

  return (
    <>
      {GOflag === false
        ? <>
          <CssBaseline />
          <AppBar position='fixed' className={classes.appBar}>
            <Toolbar>
              <Grid item align='center' xs={12} sm={12}>
                <Typography variant='h3' align='center' noWrap>
                  VDC Artifact Editor
                </Typography>
              </Grid>
            </Toolbar>
          </AppBar>
          </>
        : ''}

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <>
            <div className={classes.buttons}>
              {/* <Button
                variant='contained'
                color='primary'
                onClick={() => { console.log(JSON.stringify(masterStates, null, 2)) }}
                className={classes.button}
              >
                masterStates
              </Button> */}
            </div>
            {GOflag === true
              ? <>
                {!checkFlag ? checkForErrors(masterStates.length) : ''}
                {getSection(activeStep)}
                </>
              : <>
                {doTheDrawer()}
                {showDrawerContents()}
                </>}
          </>
        </Paper>
        <Copyright />
      </main>
    </>
  )
}
