import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { Typography, Divider } from '@material-ui/core'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
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

function SurveyFeed() {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  const [surveysInFeed, setSurveysInFeed] = useState([])
  const [noSurveyAvailableMessage, setNoSurveyAvailableMessage] = useState(
    false
  )

  const [openSurveyDialog, setOpenSurveyDialog] = useState(false)
  const [openedSurvey, setOpenedSurvey] = useState({})
  const [openedSurveyId, setOpenedSurveyId] = useState('')

  const user = useSelector((state) => {
    return state.signupReducer.user
  })

  const fetchSurveyFeed = async () => {
    try {
      let reqObj = {
        ...user,
      }
      const response = await fetch(
        `${configObj.cloudFunctionUrl}/getSurveyFeed`,
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
        setSurveysInFeed(responseObj.surveys)
        if (responseObj.surveys.length === 0) {
          setNoSurveyAvailableMessage(true)
        }
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  useEffect(() => {
    console.log(user)
    fetchSurveyFeed()
  }, [user])

  const openSurveyInDialog = (e, survey) => {
    console.log('survey', survey)
    setOpenedSurvey(survey.surveyJSON)
    setOpenSurveyDialog(true)
    setOpenedSurveyId(survey._id)
  }

  const submitSurvey = async (survey) => {
    let surveyObj = survey.data
    console.log(surveyObj)

    // Call API To submit Survey
    let reqObj = {}

    reqObj.surveyFillerUid = user.uid
    reqObj.surveyFillerName = user.name
    reqObj.surveyFillerEmail = user.email
    reqObj.surveyFillerGender = user.gender
    reqObj.surveyFillerAge = user.age
    reqObj.surveyAnswerJSON = surveyObj
    reqObj.surveyId = openedSurveyId

    console.log('reqObj', reqObj)

    try {
      const response = await fetch(
        `${configObj.cloudFunctionUrl}/submitSurvey`,
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
      //fetchSurveyFeed()
      console.log('ResponseObj', responseObj)
    } catch (error) {
      console.log('Error', error)
    }

    setOpenSurveyDialog(false)
  }

  var model = new Survey.Model(openedSurvey)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={fixedHeightPaper} style={{ maxHeight: '84vh' }}>
          <Typography variant="h5" component="h5" className={classes.divider}>
            Survey Feed
          </Typography>

          <Divider className={classes.divider} />

          {surveysInFeed.map((survey, index) => {
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
                    {survey.surveyJSON.title}
                  </Typography>
                  <div style={{ margin: '16px' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={(e) => openSurveyInDialog(e, survey)}
                    >
                      Fill Survey
                    </Button>
                  </div>
                </div>
              </React.Fragment>
            )
          })}

          {noSurveyAvailableMessage === true && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="h5"
                component="h5"
                className={classes.divider}
              >
                No Surveys Available
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
            <Survey.Survey model={model} onComplete={submitSurvey} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSurveyDialog(false)} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  )
}

export default SurveyFeed
