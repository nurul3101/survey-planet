import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Signup from './containers/signup'
import Dashboard from './containers/dashboard'

export default () => {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/" component={Signup} />
      </Switch>
    </Router>
  )
}
