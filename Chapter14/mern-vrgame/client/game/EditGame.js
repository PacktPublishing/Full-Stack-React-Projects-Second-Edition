import React, {useState} from 'react'
import auth from './../auth/auth-helper'
import {update} from './api-game.js'
import {Redirect} from 'react-router-dom'
import GameForm from './GameForm'

export default function EditGame({ match }) {
  const [redirect, setRedirect] = useState(false)
  const [error, setError]= useState('')

  const clickSubmit = game => event => {
    const jwt = auth.isAuthenticated()
    update({
      gameId: match.params.gameId
    }, {
      t: jwt.token
    }, game).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setError('')
        setRedirect(true)
      }
    })
  }

    if (redirect) {
      return (<Redirect to={'/user/'+auth.isAuthenticated().user._id}/>)
    }
    return (
      <GameForm gameId={match.params.gameId} onSubmit={clickSubmit} errorMsg={error}/>
    )

}

