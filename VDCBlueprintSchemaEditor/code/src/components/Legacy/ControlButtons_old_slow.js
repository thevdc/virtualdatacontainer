import React from 'react'
import Button from '@material-ui/core/Button'
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight'

export default function ControlButtons (props) {
  const { classes, sections, sectionNo } = props

  const Ret = React.useCallback(() => {
    return (
      <div className={classes.buttons}>
        <Button
          variant='contained'
          className={classes.button}
          onClick={props.toggleArrayPad}
        >
          <SubdirectoryArrowRightIcon />
        </Button>
        {sectionNo !== 0
          ? <Button
            className={classes.button}
            onClick={() => props.handleBack(props.state, sectionNo)}
            >
            Back
          </Button>
          : ''}
        {sectionNo !== sections.length - 1
          ? <Button
            variant='contained'
            className={classes.button}
            onClick={() => props.handleNext(props.state, sectionNo)}
            >
            Next
          </Button>
          : ''}
        <Button
          variant='contained'
          color='primary'
          onClick={props.homeButton}
          className={classes.button}
        >
        Home
        </Button>
      </div>
    )
  }, [props, classes.button, classes.buttons, sectionNo, sections.length])

  return <Ret />
}
