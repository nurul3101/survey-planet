import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import AssignmentIcon from '@material-ui/icons/Assignment'

function RespondentMenuList(props) {
  const { setSelectedPage } = props
  return (
    <div>
      <ListItem button onClick={() => setSelectedPage('dashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Survey Feed" />
      </ListItem>
      <ListItem button onClick={() => setSelectedPage('filled-surveys')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Filled Surveys" />
      </ListItem>
    </div>
  )
}

export default RespondentMenuList
