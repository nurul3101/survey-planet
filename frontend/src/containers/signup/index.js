import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toaster from 'toasted-notes'
import 'toasted-notes/src/styles.css'

import SurveyHeroImage from '../../Assets/survey.svg'
import configObj from '../../Configuration'
import firebase from '../../firebase'
import ActionTypes from './constant'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${SurveyHeroImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  ageSelect: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginTop: '3px',
  },
}))

function SignUp() {
  const classes = useStyles()

  const history = useHistory()

  const dispatch = useDispatch()

  /* Defines which Mode is selected*/
  const [selectedMode, setSelectedMode] = useState('signin')

  /* Signin State*/
  const [signinState, setSigninState] = useState({
    email: '',
    password: '',
  })

  const [signupErrors, setSignupErrors] = useState({
    name: true,
    email: true,
    password: true,
    gender: true,
    userType: true,
    age: true,
  })

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        console.log(user)
      } else {
        //User is not logged in
        console.log('Not Logged In')
      }
    })
  }, [])

  const handleSigninInput = (e) => {
    setSigninState({
      ...signinState,
      [e.target.name]: e.target.value,
    })
  }

  const executeSignIn = (e) => {
    e.preventDefault()
    console.log('Sign In', signinState)
    firebase
      .auth()
      .signInWithEmailAndPassword(signinState.email, signinState.password)
      .then(async (userObj) => {
        console.log('Successful Authentication', userObj)
        //Get User Info and push into redux store

        const requestObj = {
          uid: userObj.user.uid,
        }
        try {
          const response = await fetch(
            `${configObj.cloudFunctionUrl}/fetchUserInfo`,
            {
              method: 'post',
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...requestObj,
              }),
            }
          )

          const responseObj = await response.json()

          console.log('ResponseObj', responseObj)
          localStorage.setItem('user', JSON.stringify(responseObj.userObj))
          dispatch({
            type: ActionTypes.FetchUserInfo,
            user: responseObj.userObj,
          })

          toaster.notify('Authentication Successful', {
            duration: 2000,
            position: 'bottom-right',
          })

          history.push('/dashboard')
        } catch (error) {
          toaster.notify(`Authentication Failed: ${error}`, {
            duration: 4000,
            position: 'bottom-right',
          })
          console.log('Error', error)
        }
      })
      .catch((error) => {
        console.log('Error in Signin', error)
        toaster.notify(`Authentication Failed: ${error}`, {
          duration: 4000,
          position: 'bottom-right',
        })
      })
  }

  const [signupState, setSignupState] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    userType: '',
  })

  const handleSignupInput = (e) => {
    setSignupState({
      ...signupState,
      [e.target.name]: e.target.value,
    })
  }

  const CheckForErrors = () => {
    if (signupState.name === '') {
      return false
    } else if (signupState.email === '') {
      return false
    } else if (signupState.password === '') {
      return false
    } else if (signupState.gender === '') {
      return false
    } else if (signupState.age === '') {
      return false
    } else if (signupState.userType === '') {
      return false
    } else {
      return true
    }
  }

  const executeSignUp = async (e) => {
    e.preventDefault()

    if (CheckForErrors()) {
      let requestObj = { ...signupState }
      try {
        let response = await fetch(`${configObj.cloudFunctionUrl}/signup`, {
          method: 'post',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...requestObj,
          }),
        })

        let responseObj = await response.json()
        console.log(responseObj)

        if (responseObj.success === true) {
          localStorage.setItem('user', JSON.stringify(responseObj.userObj))

          dispatch({
            type: ActionTypes.FetchUserInfo,
            user: responseObj.userObj,
          })

          toaster.notify('Account Created Successfully', {
            duration: 2000,
            position: 'bottom-right',
          })

          history.push('/dashboard')
          // store userObj in Redux store
        } else {
          //show error
          toaster.notify('Encountered Error', {
            duration: 2000,
            position: 'bottom-right',
          })
        }
      } catch (error) {
        console.log('Error in signup', error)
        toaster.notify(`${error}`, {
          duration: 2000,
          position: 'bottom-right',
        })
      }
    } else {
      toaster.notify('Please fill required inputs', {
        duration: 2000,
        position: 'bottom-right',
      })
    }
  }

  const checkPassword = () => {
    if (signupState.password.length < 6) {
      toaster.notify('Minimum password length should be 6', {
        duration: 2000,
        position: 'bottom-right',
      })
    }
  }

  const checkEmailSignup = () => {
    if (!/\S+@\S+\.\S+/.test(signupState.email)) {
      toaster.notify('Enter Valid Email', {
        duration: 2000,
        position: 'bottom-right',
      })
    }
  }

  const checkEmailSignIn = () => {
    if (!/\S+@\S+\.\S+/.test(signinState.email)) {
      toaster.notify('Enter Valid Email', {
        duration: 2000,
        position: 'bottom-right',
      })
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={8} className={classes.image} />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        {selectedMode === 'signin' ? (
          <div className={classes.paper}>
            <Avatar className={classes.avatar}></Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={signinState.email}
                onChange={handleSigninInput}
                onBlur={checkEmailSignIn}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={signinState.password}
                onChange={handleSigninInput}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={executeSignIn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setSelectedMode('signup')}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        ) : (
          <div className={classes.paper}>
            <Avatar className={classes.avatar}></Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="name"
                    name="name"
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                    value={signupState.name}
                    onChange={handleSignupInput}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={signupState.email}
                    onChange={handleSignupInput}
                    onBlur={checkEmailSignup}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={signupState.password}
                    onChange={handleSignupInput}
                    onBlur={checkPassword}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      value={signupState.gender}
                      onChange={handleSignupInput}
                      style={{ flexDirection: 'row' }}
                    >
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    component="fieldset"
                    className={classes.ageSelect}
                  >
                    <InputLabel id="signup-age">Age</InputLabel>
                    <Select
                      labelId="signup-age"
                      id="signup-age-select"
                      name="age"
                      value={signupState.age}
                      onChange={handleSignupInput}
                      fullWidth
                    >
                      <MenuItem value={'lessThan18'}>Less than 18</MenuItem>
                      <MenuItem value={'between18And50'}>18-50</MenuItem>
                      <MenuItem value={'moreThan50'}>More than 50</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Role</FormLabel>
                    <RadioGroup
                      aria-label="user-type"
                      name="userType"
                      value={signupState.userType}
                      onChange={handleSignupInput}
                      style={{ flexDirection: 'row' }}
                    >
                      <FormControlLabel
                        value="coordinator"
                        control={<Radio />}
                        label="Coordinator"
                      />
                      <FormControlLabel
                        value="respondent"
                        control={<Radio />}
                        label="Respondent"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={executeSignUp}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setSelectedMode('signin')}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        )}
      </Grid>
    </Grid>
  )
}

export default SignUp
