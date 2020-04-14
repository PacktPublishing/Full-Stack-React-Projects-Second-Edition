import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import DeleteGame from './DeleteGame'

const useStyles = makeStyles(theme => ({
  card: {
    width: 600,
    margin: theme.spacing(2),
    display: 'inline-table',
    textAlign: 'center'
  },
  heading: {
    position: 'relative'
  },
  title: {
    position: 'absolute',
    padding: '16px 40px 16px 40px',
    fontSize: '1.15em',
    backgroundColor: '#6f6f6fcf',
    color: '#cddd39',
    left: '-5px',
    top: '14px'
  },
  maker: {
    position: 'absolute',
    top: '-44px',
    right: '0px',
    fontSize: '0.95em',
    fontWeight: '300',
    backgroundColor: '#cddd3985',
    color: 'white',
    padding: '12px 16px'
  },
  media: {
    height: 250
  },
  action: {
    padding: 0
  },
  button: {
    width: '100%',
    height: '42px',
    fontSize: '1em',
    letterSpacing: '2px'
  },
  editbutton: {
    width: '50%',
    margin: 'auto'
  },
  clue: {
    padding: '7px',
    backgroundColor: '#e8eae3'
  }
}))
export default function GameDetail(props) {
  const classes = useStyles()
    return (<Card className={classes.card}>
      <div className={classes.heading}>
        <Typography type="headline" component="h2" className={classes.title}>
          {props.game.name}
        </Typography>
      </div>
      <CardMedia className={classes.media} image={props.game.world} title={props.game.name}/>
      <div className={classes.heading}>
        <Typography type="subheading" component="h4" className={classes.maker}>
          <em>by</em>
          {props.game.maker.name}
        </Typography>
      </div>
      <CardContent className={classes.clue}>
        <Typography type="body1" component="p">
          {props.game.clue}
        </Typography>
      </CardContent>
      <div className={classes.action}>
        <a href={"/game/play?id=" + props.game._id} target='_self'>
          <Button variant="contained" color="secondary" className={classes.button}>
            Play Game
          </Button>
        </a>
      </div>
      {
        auth.isAuthenticated().user && auth.isAuthenticated().user._id == props.game.maker._id
        && (<div>
              <Link to={"/game/edit/" + props.game._id}>
                <Button variant="contained" color="primary" className={classes.editbutton}>
                  Edit
                </Button>
              </Link>
              <DeleteGame game={props.game} removeGame={props.updateGames}/>
            </div>)
      }
    </Card>)

}
GameDetail.propTypes = {
  game: PropTypes.object.isRequired,
  updateGames: PropTypes.func.isRequired
}


