import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AddBoxIcon from '@material-ui/icons/AddBox'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import VRObjectForm from './VRObjectForm'

import {read} from './api-game.js'

const useStyles = makeStyles(theme => ({

  card: {
    maxWidth: 1000,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: '1.1em'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  spacingTop: {
    marginTop: '10px'
  },
  heading: {
    width: '130px',
    padding:'10px'
  },
  objectDetails: {
    overflow: 'scroll'
  },
  imgPreview: {
    width:"300px",
    display:'block',
    margin:'auto'
  }
}))

export default function GameForm(props) {
  const classes = useStyles()
  const [readError, setReadError] = useState('')
  const [game, setGame] = useState({name: '', clue:'', world:'', answerObjects:[], wrongObjects:[]})

  useEffect(() => {
    if(props.gameId){
      const abortController = new AbortController()
      const signal = abortController.signal
    
      read({gameId: props.gameId}, signal).then((data) => {
        if (data.error) {
          setReadError(data.error)
        } else {
          setGame(data)
        }
      })
      return function cleanup(){
        abortController.abort()
      }
    }
  }, [])

  const handleChange = name => event => {
    const newGame = {...game}
    newGame[name] = event.target.value
    setGame(newGame)
  }
  const addObject = name => event => {
    const newGame = {...game}
    newGame[name].push({})
    setGame(newGame)
  }
  const handleObjectChange = (index, type, name, val) => {
    var newGame = {...game}
    newGame[type][index][name] = val
    setGame(newGame)
  }

  const removeObject = (type, index) => event => {
    const newGame = {...game}
    newGame[type].splice(index, 1)
    setGame(newGame)
  }
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            {props.gameId? 'Edit': 'New'} Game
          </Typography>
          <img src={game.world} className={classes.imgPreview}/>
          <TextField id="world" label="Game World Equirectangular Image (URL)" className={classes.textField} value={game.world} onChange={handleChange('world')} margin="normal"/><br/>
          <TextField id="name" label="Name" className={classes.textField} value={game.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField id="multiline-flexible" label="Clue Text" multiline rows="2" value={game.clue} onChange={handleChange('clue')} className={classes.textField} margin="normal"/><br/>
          <Divider className={classes.spacingTop}/>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>VR Objects to collect</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.objectDetails}>
              {
                game.answerObjects.map((item, i) => {
                  return <div key={i}>
                    <VRObjectForm handleUpdate={handleObjectChange} index={i} type={'answerObjects'} vrObject={item} removeObject={removeObject}/>
                  </div>
                })
              }
              <Button color="primary" variant="contained" onClick={addObject('answerObjects')}><AddBoxIcon color="secondary" style={{marginRight: '8px'}}/> Add Object</Button>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Other VR objects</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {
                game.wrongObjects.map((item, i) => {
                  return <div key={i}>
                    <VRObjectForm handleUpdate={handleObjectChange} index={i} type={'wrongObjects'} vrObject={item} removeObject={removeObject}/>
                  </div>
                })
              }
              <Button color="primary" variant="contained" onClick={addObject('wrongObjects')}><AddBoxIcon color="secondary" style={{marginRight: '8px'}}/> Add Object</Button>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {
            (props.errorMsg || readError)
            && (<Typography component="p" color="error">
                  <Icon color="error" className={classes.error}>error</Icon>
                  {props.errorMsg || readError }
               </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={props.onSubmit(game)} className={classes.submit}>Submit</Button>
          <Link to='/' className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    )

}

GameForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errorMsg: PropTypes.string,
  gameId: PropTypes.string
}
