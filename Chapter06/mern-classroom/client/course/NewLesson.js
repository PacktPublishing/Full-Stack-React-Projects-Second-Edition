import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Add from '@material-ui/icons/AddBox'
import {makeStyles} from '@material-ui/core/styles'
import {newLesson} from './api-course'
import auth from './../auth/auth-helper'

const useStyles = makeStyles(theme => ({
    form: {
        minWidth: 500
    }
}))

export default function NewLesson(props) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({
    title: '',
    content: '',
    resource_url: ''
  })
  
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }
  const clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const lesson = {
      title: values.title || undefined,
      content: values.content || undefined,
      resource_url: values.resource_url || undefined
    }
    newLesson({
      courseId: props.courseId
    }, {
      t: jwt.token
    }, lesson).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
          props.addLesson(data)
          setValues({...values, title: '',
          content: '',
          resource_url: ''})
          setOpen(false)
      }
    })
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button aria-label="Add Lesson" color="primary" variant="contained" onClick={handleClickOpen}>
        <Add/> &nbsp; New Lesson
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <div className={classes.form}>
        <DialogTitle id="form-dialog-title">Add New Lesson</DialogTitle>
        <DialogContent>
          
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={values.title} onChange={handleChange('title')}
          /><br/>
          <TextField
            margin="dense"
            label="Content"
            type="text"
            multiline
            rows="5"
            fullWidth
            value={values.content} onChange={handleChange('content')}
          /><br/>
          <TextField
            margin="dense"
            label="Resource link"
            type="text"
            fullWidth
            value={values.resource_url} onChange={handleChange('resource_url')}
          /><br/>
          
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={clickSubmit} color="secondary" variant="contained">
            Add
          </Button>
        </DialogActions>
        </div>
      </Dialog>
    </div>
  )
}
NewLesson.propTypes = {
    courseId: PropTypes.string.isRequired,
    addLesson: PropTypes.func.isRequired
  }