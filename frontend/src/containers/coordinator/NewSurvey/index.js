import React, { useState, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import clsx from 'clsx'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import * as Survey from 'survey-react'
import 'survey-react/survey.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: '80vh',
  },
  button: {
    margin: theme.spacing(2),
  },
}))

function NewSurvey() {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  const [surveyTitle, setSurveyTitle] = useState('')
  const [surveyJSON, setSurveyJSON] = useState({ questions: [] })

  const [openTextInputDialog, setOpenTextInputDialog] = useState(false)
  const [placeholderQuestion, setPlaceholderQuestion] = useState('')

  const [openRadioDialog, setOpenRadioDialog] = useState(false)

  const onComplete = (survey, options) => {
    console.log('survey')
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
            Add Multiple Choice Question
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => {
              setPlaceholderQuestion('')
              setOpenTextInputDialog(true)
            }}
          >
            Save Survey
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
