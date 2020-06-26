import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Signup from './containers/signup'

export default () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Signup} />
      </Switch>
    </Router>
  )
}
