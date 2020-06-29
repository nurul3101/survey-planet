import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { useHistory } from 'react-router-dom'

function CoordinatorMenuList() {
  const history = useHistory()
  const handleNewSurvey = () => {
    history.push('/new-survey')
  }
  return (
    <React.Fragment>
      <div>
        <ListItem button onClick={handleNewSurvey}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="New Survey" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Responses" />
        </ListItem>
        <ListItem button>
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
