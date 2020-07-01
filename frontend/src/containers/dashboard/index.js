import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import NavigationBar from '../../Components/NavigationBar'
import { useDispatch, useSelector } from 'react-redux'

import NewSurvey from '../Coordinator/NewSurvey'
import YourSurveys from '../Coordinator/YourSurveys'
import SurveyResponses from '../Coordinator/SurveyResponses'

import SurveyFeed from '../Respondent/SurveyFeed'
import RespondentSurveys from '../Respondent/RespondentSurveys'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {},
}))

function Dashboard() {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  const [selectedPage, setSelectedPage] = useState('dashboard')

  const user = useSelector((state) => {
    return state.signupReducer.user
  })

  return (
    <div className={classes.root}>
      <NavigationBar setSelectedPage={setSelectedPage} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {selectedPage === 'dashboard' && (
            <React.Fragment>
              {user.userType === 'respondent' ? <SurveyFeed /> : <NewSurvey />}
            </React.Fragment>
          )}
          {selectedPage === 'responses' && (
            <React.Fragment>
              <SurveyResponses />
            </React.Fragment>
          )}
          {selectedPage === 'your-surveys' && (
            <React.Fragment>
              <YourSurveys />
            </React.Fragment>
          )}
          {selectedPage === 'filled-surveys' && (
            <React.Fragment>
              <RespondentSurveys />
            </React.Fragment>
          )}
        </Container>
      </main>
    </div>
  )
}

export default Dashboard
