import React from 'react'
import Button from '@material-ui/core/Button'

function ControlButtons (props) {
  const { classes, sections, sectionNo } = props

  return (
    <div className={classes.buttons}>
      {sectionNo !== 0
        ? <Button
          variant='contained'
          className={classes.button}
          onClick={() => props.handleBack(props.state, sectionNo)}
          >
          {'<'} Prev
          </Button>
        : ''}
      <Button
        variant='contained'
        className={classes.button}
        disabled={sectionNo === sections.length - 1}
        onClick={() => props.handleNext(props.state, sectionNo)}
      >
        Next {'>'}
      </Button>
      <Button
        variant='contained'
        color='primary'
        onClick={props.homeButton}
        className={classes.buttonMain}
      >
        Home
      </Button>
    </div>
  )
}

function areEqual (prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default React.memo(ControlButtons, areEqual)
