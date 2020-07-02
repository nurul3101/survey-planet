import React, { useState, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import clsx from 'clsx'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DateFnsUtils from '@date-io/date-fns'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import Checkbox from '@material-ui/core/Checkbox'
import { Typography, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as Survey from 'survey-react'
import { useSelector } from 'react-redux'
import 'survey-react/survey.css'

import toaster from 'toasted-notes'
import 'toasted-notes/src/styles.css'

import configObj from '../../../Configuration'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: '87vh',
  },
  button: {
    margin: theme.spacing(2),
  },
  checkbox: {
    margin: theme.spacing(1),
  },
}))

function NewSurvey() {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  const user = useSelector((state) => {
    return state.signupReducer.user
  })

  const [surveyTitle, setSurveyTitle] = useState('')
  const [surveyJSON, setSurveyJSON] = useState({ questions: [] })

  const [openTextInputDialog, setOpenTextInputDialog] = useState(false)
  const [placeholderQuestion, setPlaceholderQuestion] = useState('')

  const [openRadioDialog, setOpenRadioDialog] = useState(false)

  const [visibilityState, setVisibilityState] = useState({
    shareToAllCheckbox: false,
    shareToMale: false,
    shareToFemale: false,
    lessThan18: false,
    between18And50: false,
    moreThan50: false,
  })

  const [visibilityDate, setVisibilityDate] = React.useState(new Date())

  const handleVisibilityDateChange = (date) => {
    setVisibilityDate(date)
  }

  const handleCheckboxChange = (e) => {
    setVisibilityState({
      ...visibilityState,
      [e.target.name]: e.target.checked,
    })

    if (e.target.name === 'shareToAllCheckbox' && e.target.checked === true) {
      setVisibilityState({
        ...visibilityState,
        shareToAllCheckbox: true,
        shareToMale: false,
        shareToFemale: false,
        lessThan18: false,
        between18And50: false,
        moreThan50: false,
      })
    }
  }

  const CheckForErrors = () => {
    if (surveyTitle === '') {
      toaster.notify('Enter Survey Title', {
        duration: 2000,
        position: 'bottom-right',
      })
      return false
    } else if (
      visibilityState.shareToAllCheckbox === false &&
      visibilityState.shareToMale === false &&
      visibilityState.lessThan18 === false &&
      visibilityState.shareToFemale === false &&
      visibilityState.between18And50 === false &&
      visibilityState.moreThan50 === false
    ) {
      toaster.notify('Select Survey Visibility', {
        duration: 2000,
        position: 'bottom-right',
      })
      return false
    } else if (surveyJSON.questions.length === 0) {
      toaster.notify('Enter Atleast One Question', {
        duration: 2000,
        position: 'bottom-right',
      })
      return false
    } else {
      return true
    }
  }

  const saveSurvey = async (e) => {
    console.log('surveyJSON', surveyJSON)
    if (CheckForErrors()) {
      let reqObj = {}
      reqObj.surveyCreatorUid = user.uid
      reqObj.surveyCreatorName = user.name
      reqObj.surveyJSON = surveyJSON
      reqObj.visibleTillDate = visibilityDate
      reqObj.visibleTillDateTs = new Date(visibilityDate).getTime()
      reqObj.surveyAuthorization = []

      if (visibilityState.shareToAllCheckbox === true) {
        reqObj.surveyAuthorization.push('all')
      } else {
        for (const [key, value] of Object.entries(visibilityState)) {
          if (value === true) {
            reqObj.surveyAuthorization.push(key)
          }
        }
      }
      console.log('reqObj', reqObj)

      try {
        const response = await fetch(
          `${configObj.cloudFunctionUrl}/createNewSurvey`,
          {
            method: 'post',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...reqObj,
            }),
          }
        )

        const responseObj = await response.json()

        console.log('ResponseObj', responseObj)
        if (responseObj.success === true) {
          toaster.notify('Survey Created', {
            duration: 2000,
            position: 'bottom-right',
          })
          setVisibilityState({
            shareToAllCheckbox: false,
            shareToMale: false,
            shareToFemale: false,
            lessThan18: false,
            between18And50: false,
            moreThan50: false,
          })
          setSurveyJSON({ questions: [] })
          setSurveyTitle('')
        }
      } catch (error) {
        console.log('Error', error)
        toaster.notify(`Operation Failed: ${error}`, {
          duration: 2000,
          position: 'bottom-right',
        })
      }
    }
  }

  const onSurveyTitleChange = (e) => {
    setSurveyTitle(e.target.value)
    setSurveyJSON({
      ...surveyJSON,
      title: e.target.value,
    })
  }

  const inputEl = useRef(null)
  const multipleChoiceEl = useRef(null)
  const option1El = useRef(null)
  const option2El = useRef(null)
  const option3El = useRef(null)
  const option4El = useRef(null)

  var model = new Survey.Model(surveyJSON)
  model.mode = 'display'

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Survey.Survey model={model} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <TextField
            id="standard-basic"
            label="Survey Title"
            autoFocus={false}
            onChange={onSurveyTitleChange}
            value={surveyTitle}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              setPlaceholderQuestion('')
              setOpenTextInputDialog(true)
            }}
          >
            Add Text Question
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              setOpenRadioDialog(true)
            }}
          >
            Add Multiple Choice
          </Button>

          <Typography variant="h6" component="h6" className={classes.checkbox}>
            Survey Visibility
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={visibilityState.shareToAllCheckbox}
                onChange={handleCheckboxChange}
                name="shareToAllCheckbox"
                color="primary"
              />
            }
            label="Share to All"
            className={classes.checkbox}
          />
          <Divider />
          <FormControlLabel
            control={
              <Checkbox
                checked={visibilityState.shareToMale}
                onChange={handleCheckboxChange}
                name="shareToMale"
                color="primary"
                disabled={visibilityState.shareToAllCheckbox}
              />
            }
            label="Male"
            className={classes.checkbox}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={visibilityState.shareToFemale}
                onChange={handleCheckboxChange}
                name="shareToFemale"
                color="primary"
                disabled={visibilityState.shareToAllCheckbox}
              />
            }
            label="Female"
            className={classes.checkbox}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={visibilityState.lessThan18}
                onChange={handleCheckboxChange}
                name="lessThan18"
                color="primary"
                disabled={visibilityState.shareToAllCheckbox}
              />
            }
            label="Age Less than 18"
            className={classes.checkbox}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={visibilityState.between18And50}
                onChange={handleCheckboxChange}
                name="between18And50"
                color="primary"
                disabled={visibilityState.shareToAllCheckbox}
              />
            }
            label="Age Between 18-50"
            className={classes.checkbox}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={visibilityState.moreThan50}
                onChange={handleCheckboxChange}
                name="moreThan50"
                color="primary"
                disabled={visibilityState.shareToAllCheckbox}
              />
            }
            label="Age Above 50"
            className={classes.checkbox}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              disablePast
              label="Visible Till"
              value={visibilityDate}
              onChange={handleVisibilityDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>

          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={saveSurvey}
          >
            Create Survey
          </Button>
        </Paper>
      </Grid>

      <Dialog
        open={openTextInputDialog}
        onClose={() => setOpenTextInputDialog(false)}
        aria-labelledby="form-dialog-title"
        maxWidth={'md'}
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          Enter Text for Question
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Your Question"
            type="text"
            fullWidth
            inputRef={inputEl}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTextInputDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log(inputEl.current)
              setSurveyJSON({
                ...surveyJSON,
                questions: [
                  ...surveyJSON.questions,
                  {
                    type: 'text',
                    title: inputEl.current.value,
                  },
                ],
              })
              setOpenTextInputDialog(false)
            }}
            color="primary"
          >
            Add Question
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRadioDialog}
        onClose={() => setOpenRadioDialog(false)}
        aria-labelledby="form-dialog-title"
        maxWidth={'md'}
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          Enter Text for Multiple Choice Question
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Your Multiple Choice Question"
            type="text"
            fullWidth
            inputRef={multipleChoiceEl}
          />
          <div style={{ display: 'inline-grid' }}>
            <TextField
              margin="dense"
              label="Option 1"
              type="text"
              inputRef={option1El}
            />
            <TextField
              margin="dense"
              label="Option 2"
              type="text"
              inputRef={option2El}
            />
            <TextField
              margin="dense"
              label="Option 3"
              type="text"
              inputRef={option3El}
            />
            <TextField
              margin="dense"
              label="Option 4"
              type="text"
              inputRef={option4El}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRadioDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log(inputEl.current)
              setSurveyJSON({
                ...surveyJSON,
                questions: [
                  ...surveyJSON.questions,
                  {
                    type: 'radiogroup',
                    title: multipleChoiceEl.current.value,
                    choices: [
                      option1El.current.value,
                      option2El.current.value,
                      option3El.current.value,
                      option4El.current.value,
                    ],
                  },
                ],
              })
              setOpenRadioDialog(false)
            }}
            color="primary"
          >
            Add Multiple Choice Question
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default NewSurvey
