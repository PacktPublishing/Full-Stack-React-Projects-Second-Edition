import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {list} from '../game/api-game.js'
import GameDetail from '../game/GameDetail'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: '10px 24px',
  }
}))

export default function Home(){
  const classes = useStyles()
  const [games, setGames] = useState([])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list(signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setGames(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const updateGames = (game) => {
    const updatedGames = [...games]
    const index = updatedGames.indexOf(game)
    updatedGames.splice(index, 1)
    setGames(updatedGames)
  }
    return (
      <div className={classes.root}>
        {games.map((game, i) => {
          return <GameDetail key={i} game={game} updateGames={updateGames}/>
        })}
      </div>
    )
}
