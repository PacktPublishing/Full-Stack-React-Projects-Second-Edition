import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import {read, complete} from './api-enrollment.js'
import {Link} from 'react-router-dom'
import auth from './../auth/auth-helper'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Info from '@material-ui/icons/Info'
import CheckCircle from '@material-ui/icons/CheckCircle'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import { CardContent } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        maxWidth: 800,
        margin: 'auto',
        marginTop: theme.spacing(12),
        marginLeft: 250
      }),
      heading: {
        marginBottom: theme.spacing(3),
        fontWeight: 200
      },
  flex:{
    display:'flex',
    marginBottom: 20
  },
  card: {
    padding:'24px 40px 20px'
  },
  subheading: {
    margin: '10px',
    color: theme.palette.openTitle
  },
  details: {
    margin: '16px',
  },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em'
  },
  avatar: {
    color: '#9b9b9b',
    border: '1px solid #bdbdbd',
    background: 'none'
  },
  media: {
    height: 180,
    display: 'inline-block',
    width: '100%',
    marginLeft: '16px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  category:{
    color: '#5c5c5c',
    fontSize: '0.9em',
    padding: '3px 5px',
    backgroundColor: '#dbdbdb',
    borderRadius: '0.2em',
    marginTop: 5
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    backgroundColor: '#616161'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  selectedDrawer: {
      backgroundColor: '#e9e3df'
  },
  unselected: {
      backgroundColor: '#ffffff'
  },
  check: {
      color:'#38cc38'
  },
  subhead: {
      fontSize: '1.2em'
  },
  progress: {
      textAlign: 'center',
      color: '#dfdfdf',
      '& span':{
        color: '#fffde7',
        fontSize: '1.15em'
      }
    },
  para: {
    whiteSpace: 'pre-wrap'
  }
}))

export default function Enrollment ({match}) {
  const classes = useStyles()
  const [enrollment, setEnrollment] = useState({course:{instructor:[]}, lessonStatus: []})
  const [values, setValues] = useState({
      error: '',
      drawer: -1
    })
  const [totalComplete, setTotalComplete] = useState(0)
    const jwt = auth.isAuthenticated()
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({enrollmentId: match.params.enrollmentId}, {t: jwt.token}, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: data.error})
        } else {
          totalCompleted(data.lessonStatus)
          setEnrollment(data)
        }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.enrollmentId])
  const totalCompleted = (lessons) => {
    let count = lessons.reduce((total, lessonStatus) => {return total + (lessonStatus.complete ? 1 : 0)}, 0)
    setTotalComplete(count)
    return count
  }
  const selectDrawer = (index) => event => {
      setValues({...values, drawer:index})
  }
  const markComplete = () => {
      if(!enrollment.lessonStatus[values.drawer].complete){
        const lessonStatus = enrollment.lessonStatus
        lessonStatus[values.drawer].complete = true
        let count = totalCompleted(lessonStatus)

        let updatedData = {}
        updatedData.lessonStatusId = lessonStatus[values.drawer]._id
        updatedData.complete = true

        if(count == lessonStatus.length){
            updatedData.courseCompleted = Date.now()
        }

      complete({
        enrollmentId: match.params.enrollmentId
      }, {
        t: jwt.token
      }, updatedData).then((data) => {
        if (data && data.error) {
          setValues({...values, error: data.error})
        } else {
          setEnrollment({...enrollment, lessonStatus: lessonStatus})
        }
      })
    }
  }
    const imageUrl = enrollment.course._id
          ? `/api/courses/photo/${enrollment.course._id}?${new Date().getTime()}`
          : '/api/courses/defaultphoto'
    return (
        <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      ><div className={classes.toolbar} />
      <List>
      <ListItem button onClick={selectDrawer(-1)} className={values.drawer == -1 ? classes.selectedDrawer : classes.unselected}>
            <ListItemIcon><Info /></ListItemIcon>
            <ListItemText primary={"Course Overview"} />
      </ListItem>
      </List>
      <Divider />
      <List className={classes.unselected}>
      <ListSubheader component="div" className={classes.subhead}>
          Lessons
        </ListSubheader>
        {enrollment.lessonStatus.map((lesson, index) => (
          <ListItem button key={index} onClick={selectDrawer(index)} className={values.drawer == index ? classes.selectedDrawer : classes.unselected}>
            <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                        {index+1}
                        </Avatar>
            </ListItemAvatar>
            <ListItemText primary={enrollment.course.lessons[index].title} />
            <ListItemSecondaryAction>
                    { lesson.complete ? <CheckCircle className={classes.check}/> : <RadioButtonUncheckedIcon />}
                    </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
          <ListItem>
        <ListItemText primary={<div className={classes.progress}><span>{totalComplete}</span> out of <span>{enrollment.lessonStatus.length}</span> completed</div>} />
          </ListItem>
      </List>
    </Drawer>
              {values.drawer == - 1 && 
              <Card className={classes.card}>
                <CardHeader
                  title={enrollment.course.name}
                  subheader={<div>
                        <Link to={"/user/"+enrollment.course.instructor._id} className={classes.sub}>By {enrollment.course.instructor.name}</Link>
                        <span className={classes.category}>{enrollment.course.category}</span>
                      </div>
                    }
                  action={
                    totalComplete == enrollment.lessonStatus.length &&
                (<span className={classes.action}>
                  <Button variant="contained" color="secondary">
                    <CheckCircle /> &nbsp; Completed
                  </Button>
                </span>)
            }
                />
                <div className={classes.flex}>
                  <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={enrollment.course.name}
                  />
                  <div className={classes.details}>
                    <Typography variant="body1" className={classes.subheading}>
                        {enrollment.course.description}<br/>
                    </Typography>
                  </div>
                </div>
                <Divider/>
                <div>
                <CardHeader
                  title={<Typography variant="h6" className={classes.subheading}>Lessons</Typography>
                }
                  subheader={<Typography variant="body1" className={classes.subheading}>{enrollment.course.lessons && enrollment.course.lessons.length} lessons</Typography>}
                  action={
             auth.isAuthenticated().user && auth.isAuthenticated().user._id == enrollment.course.instructor._id &&
                (<span className={classes.action}>
                  
                </span>)
            }
                />
                <List>
                {enrollment.course.lessons && enrollment.course.lessons.map((lesson, i) => {
                    return(<span key={i}>
                    <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                        {i+1}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={lesson.title}
                    />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    </span>)
                }
                )}
                </List>
                </div>
            </Card> }
             {values.drawer != -1 && (<>
             <Typography variant="h5" className={classes.heading}>{enrollment.course.name}</Typography>
             <Card className={classes.card}>
                <CardHeader
                  title={enrollment.course.lessons[values.drawer].title}
                  action={<Button onClick={markComplete} variant={enrollment.lessonStatus[values.drawer].complete? 'contained' : 'outlined'} color="secondary">{enrollment.lessonStatus[values.drawer].complete? "Completed" : "Mark as complete"}</Button>} />
                  <CardContent> 
                      <Typography variant="body1" className={classes.para}>{enrollment.course.lessons[values.drawer].content}</Typography>
                  </CardContent>
                  <CardActions>
                    <a href={enrollment.course.lessons[values.drawer].resource_url}><Button variant="contained" color="primary">Resource Link</Button></a>
                </CardActions>
                </Card></>)}
        </div>)
}