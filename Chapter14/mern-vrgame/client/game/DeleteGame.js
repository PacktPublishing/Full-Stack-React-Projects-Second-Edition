import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import auth from './../auth/auth-helper'
import {remove} from './api-game.js'

export default function DeleteGame(props) {
  const [open, setOpen] = useState(false)
  
  const jwt = auth.isAuthenticated()
  const clickButton = () => {
    setOpen(true)
  }
  const deleteGame = () => {
    remove({
      gameId: props.game._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setOpen(false)
        props.removeGame(props.game)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }
    return (<span>
      <Button variant="contained" onClick={clickButton} style={{width: '50%', margin: 'auto'}}>
        Delete
      </Button>
      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete "+props.game.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your game {props.game.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteGame} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)
  
}
DeleteGame.propTypes = {
  game: PropTypes.object.isRequired,
  removeGame: PropTypes.func.isRequired
}

