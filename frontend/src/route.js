import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Signup from './containers/signup'
import Dashboard from './containers/dashboard'
import NewSurvey from './containers/coordinator/NewSurvey'

export default () => {
  return (
    <Router>
      <Switch>
        <Route path="/new-survey" component={NewSurvey} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/" component={Signup} />
      </Switch>
    </Router>
  )
}
