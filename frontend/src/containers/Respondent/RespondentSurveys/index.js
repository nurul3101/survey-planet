import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'
import { Typography, Divider } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import * as Survey from 'survey-react'
import 'survey-react/survey.css'
import configObj from '../../../Configuration'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    //height: 240,
  },
  divider: {
    margin: theme.spacing(2),
  },
}))

function RespondentSurveys() {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  const user = useSelector((state) => {
    return state.signupReducer.user
  })

  const [surveys, setSurveys] = useState([])
  const [showNoSurveyMessage, setShowNoSurveyMessage] = useState(false)

  const [openSurveyDialog, setOpenSurveyDialog] = useState(false)

  const [openedSurvey, setOpenedSurvey] = useState({})
  const [openedSurveyData, setOpenedSurveyData] = useState({})

  const fetchRespondentSurveys = async () => {
    try {
      let reqObj = {
        uid: user.uid,
      }
      const response = await fetch(
        `${configObj.cloudFunctionUrl}/getRespondentSurveys`,
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

      console.log('responseObj', responseObj)
      if (responseObj.success === true) {
        setSurveys(responseObj.surveys)
        if (responseObj.surveys.length === 0) {
          setShowNoSurveyMessage(true)
        }
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  useEffect(() => {
    console.log('User@', user)
    fetchRespondentSurveys()
  }, [user])

  const openSurveyInDialog = (e, survey) => {
    console.log('survey', survey)
    setOpenedSurvey(survey.surveyQuestionObj.surveyJSON)
    setOpenedSurveyData(survey.surveyAnswerObj.surveyAnswerJSON)
    setOpenSurveyDialog(true)
  }

  var model = new Survey.Model(openedSurvey)
  model.mode = 'display'
  model.data = openedSurveyData

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={fixedHeightPaper}>
          <Typography variant="h5" component="h5" className={classes.divider}>
            Respondent Filled Surveys
          </Typography>

          <Divider className={classes.divider} />

          {surveys.map((survey, index) => {
            return (
              <React.Fragment key={index}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography
                    variant="h6"
                    component="h6"
                    className={classes.divider}
                  >
                    {survey.surveyQuestionObj.surveyJSON.title}
                  </Typography>
                  <div style={{ margin: '16px' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={(e) => openSurveyInDialog(e, survey)}
                    >
                      View Survey
                    </Button>
                  </div>
                </div>
              </React.Fragment>
            )
          })}

          {showNoSurveyMessage === true && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="h5"
                component="h5"
                className={classes.divider}
              >
                No Surveys Filled
              </Typography>
            </div>
          )}
        </Paper>

        <Dialog
          open={openSurveyDialog}
          onClose={() => setOpenSurveyDialog(false)}
          aria-labelledby="form-dialog-title"
          maxWidth={'md'}
          fullWidth
        >
          <DialogTitle id="form-dialog-title">Survey</DialogTitle>
          <DialogContent>
            <Survey.Survey model={model} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSurveyDialog(false)} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  )
}

export default RespondentSurveys
