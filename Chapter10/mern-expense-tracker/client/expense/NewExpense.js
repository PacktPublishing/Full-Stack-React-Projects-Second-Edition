import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import auth from '../auth/auth-helper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import {create} from './api-expense.js'
import {Link, Redirect} from 'react-router-dom'
import DateFnsUtils from '@date-io/date-fns'
import { DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
}))

export default function NewExpense() {
  const classes = useStyles()
  
  const [values, setValues] = useState({
      title: '',
      category: '',
      amount: '',
      incurred_on: new Date(),
      notes: '',
      error: ''
  })
  const jwt = auth.isAuthenticated()
  
  const handleChange = name => event => {
    setValues({...values, [name]: event.target.value })
  }
  const handleDateChange = date => {
    setValues({...values, incurred_on: date })
  }

  const clickSubmit = () => {
    const expense = {
        title: values.title || undefined,
        category: values.category || undefined,
        amount: values.amount || undefined,
        incurred_on: values.incurred_on || undefined,
        notes: values.notes || undefined 
    }
    create({
        t: jwt.token
    }, expense).then((data) => {
        if (data.error) {
          setValues({...values, error: data.error})
        } else {
          setValues({...values, error: '', redirect: true})
        }
    })
  }

    if (values.redirect) {
      return (<Redirect to={'/'}/>)
    }
    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Expense Record
          </Typography>
          <br/>
          <TextField id="title" label="Title" className={classes.textField} value={values.title} onChange={handleChange('title')} margin="normal"/><br/>
          <TextField id="amount" label="Amount ($)" className={classes.textField} value={values.amount} onChange={handleChange('amount')} margin="normal" type="number"/><br/>
          
          <TextField id="category" label="Category" className={classes.textField} value={values.category} onChange={handleChange('category')} margin="normal"/><br/>
          <br/>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                    label="Incurred on"
                    className={classes.textField}
                    views={["year", "month", "date"]}
                    value={values.incurred_on}
                    onChange={handleDateChange}
                    showTodayButton
                />
          </MuiPickersUtilsProvider>
          <br/>
          <br/>
          <TextField
            id="multiline-flexible"
            label="Notes"
            multiline
            rows="2"
            value={values.notes}
            onChange={handleChange('notes')}
            className={classes.textField}
            margin="normal"
          /><br/> <br/>
           {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
          <Link to='/myauctions' className={classes.submit}><Button variant="contained">Cancel</Button></Link>
        </CardActions>
      </Card>
    </div>)
}
