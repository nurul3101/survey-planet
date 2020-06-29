import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Signup from './Containers/Signup'
import Dashboard from './Containers/Dashboard'

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
