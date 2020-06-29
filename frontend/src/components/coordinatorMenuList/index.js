import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { useHistory } from 'react-router-dom'

function CoordinatorMenuList(props) {
  const history = useHistory()
  const { setSelectedPage } = props
  return (
    <React.Fragment>
      <div>
        <ListItem button onClick={() => setSelectedPage('dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => setSelectedPage('responses')}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Responses" />
        </ListItem>
        <ListItem button onClick={() => setSelectedPage('your-surveys')}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Your Surveys" />
        </ListItem>
      </div>
    </React.Fragment>
  )
}

export default CoordinatorMenuList
