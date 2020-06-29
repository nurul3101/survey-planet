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
    </Grid>
  )
}

export default NewSurvey
