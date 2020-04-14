import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import AddIcon from '@material-ui/icons/AddBoxRounded'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#69f0ae'}
  else
    return {color: '#ffffff'}
}
const isButtonActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return {color: '#fffde7', backgroundColor: '#2bbd7e', marginRight:10}
  else
    return {color: '#2bbd7e', backgroundColor: '#ffffff', border:'1px solid #2bbd7e', marginRight:10}
}
const Menu = withRouter(({history}) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        MERN Expense Tracker
      </Typography>
      <div>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(history, "/")}>
            <HomeIcon/>
          </IconButton>
        </Link>
        {
          auth.isAuthenticated() && (<span>
            <Link to={"/expenses/all"}>
              <Button style={isActive(history, "/expenses/all")}>Expenses</Button>
            </Link>
            <Link to={"/expenses/reports"}>
              <Button style={isActive(history, "/expenses/reports")}>Reports</Button>
            </Link>
          </span>)
        }
      </div>
      <div style={{'position':'absolute', 'right': '10px'}}><span style={{'float': 'right'}}>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          <Link to="/expenses/new"><Button style={isButtonActive(history, "/expenses/new")}><AddIcon style={{marginRight: 4}}/> Add Expense</Button></Link>  
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
          </Link>
          <Button color="inherit" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}>Sign out</Button>
        </span>)
      }
      </span></div>
    </Toolbar>
  </AppBar>
))

export default Menu
