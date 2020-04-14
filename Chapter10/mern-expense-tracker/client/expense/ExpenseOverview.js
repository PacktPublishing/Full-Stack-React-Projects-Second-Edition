import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import {Link} from 'react-router-dom'
import auth from '../auth/auth-helper'
import {currentMonthPreview, expenseByCategory} from './../expense/api-expense.js'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 800,
    margin: 'auto',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  title2: {
    padding:`32px ${theme.spacing(2.5)}px 2px`,
    color: '#2bbd7e'
  },
  totalSpent: {
    padding: '50px 40px',
    fontSize: '4em',
    margin: 20,
    marginBottom: 30,
    backgroundColor: '#01579b',
    color: '#70f0ae',
    textAlign: 'center',
    borderRadius: '50%',
    border: '10px double #70f0ae',
    fontWeight: 300
  },
  categorySection: {
    padding: 25,
    paddingTop: 16,
    margin: 'auto'
  },
  catDiv: {
    height: '4px',
    margin: '0',
    marginBottom: 8
  },
  val: {
    width: 200,
    display: 'inline-table',
    textAlign: 'center',
    margin: 2
  },
  catTitle: {
    display: 'inline-block',
    padding: 10,
    backgroundColor: '#f4f6f9'
  },
  catHeading: {
    color: '#6b6b6b',
    fontSize: '1.15em',
    backgroundColor: '#f7f7f7',
    padding: '4px 0'
  },
  spent: {
    margin: '16px 10px 10px 0',
    padding: '10px 30px',
    border: '4px solid #58bd7f38',
    borderRadius: '0.5em'
  },
  day: {
    fontSize: '0.9em',
    fontStyle: 'italic',
    color: '#696969'
  }
}))

export default function Home(){
  const classes = useStyles()
  const [expensePreview, setExpensePreview] = useState({month:0, today:0, yesterday:0})
  const [expenseCategories, setExpenseCategories] = useState([])
  const jwt = auth.isAuthenticated()
  useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
      currentMonthPreview({t: jwt.token}, signal).then((data) => {
        if (data.error) {
          setRedirectToSignin(true)
        } else {
          setExpensePreview(data)
        }
      })
      return function cleanup(){
        abortController.abort()
      }
  }, [])
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    expenseByCategory({t: jwt.token}, signal).then((data) => {
      if (data.error) {
        setRedirectToSignin(true)
      } else {
        setExpenseCategories(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
  const indicateExpense = (values) => {
    let color = '#4f83cc'
    if(values.total){
      const diff = values.total-values.average
      if( diff > 0){
        color = '#e9858b'
      }
      if( diff < 0 ){
        color = '#2bbd7e'
      } 
    }
    return color
  }
    return (
        <Card className={classes.card}>
            <Typography variant="h4" className={classes.title2} color="textPrimary" style={{textAlign:'center'}}>You've spent</Typography>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Typography component="span" className={classes.totalSpent}>${expensePreview.month ? expensePreview.month.totalSpent : '0'} <span style={{display: 'block', fontSize:'0.3em'}}>so far this month</span></Typography>
                <div style={{margin:'20px 20px 20px 30px' }}>
                  <Typography variant="h5" className={classes.spent} color="primary">${expensePreview.today ? expensePreview.today.totalSpent : '0'} <span className={classes.day}>today</span></Typography>
                  <Typography variant="h5" className={classes.spent} color="primary">${expensePreview.yesterday ? expensePreview.yesterday.totalSpent: '0'} <span className={classes.day}>yesterday </span></Typography>
                  <Link to="/expenses/all"><Typography variant="h6">See more</Typography></Link>
                </div>
              </div>
              <Divider/>
              <div className={classes.categorySection}>
              {expenseCategories.map((expense, index) => {
                return(<div key={index} style={{display: 'grid', justifyContent: 'center'}}> 
                <Typography variant="h5" className={classes.catTitle} >{expense._id}</Typography>
                <Divider className={classes.catDiv} style={{ backgroundColor: indicateExpense(expense.mergedValues)}}/>
                <div>
                <Typography component="span" className={`${classes.catHeading} ${classes.val}`}>past average</Typography>
                <Typography component="span" className={`${classes.catHeading} ${classes.val}`}>this month</Typography>
                <Typography component="span" className={`${classes.catHeading} ${classes.val}`}>{expense.mergedValues.total && expense.mergedValues.total-expense.mergedValues.average > 0 ? "spent extra" : "saved"}</Typography>
                </div>
                <div style={{marginBottom: 3}}>
                <Typography component="span" className={classes.val} style={{color:'#595555', fontSize:'1.15em'}}>${expense.mergedValues.average}</Typography>
                <Typography component="span" className={classes.val} style={{color:'#002f6c', fontSize:'1.6em', backgroundColor: '#eafff5', padding: '8px 0'}}>${expense.mergedValues.total? expense.mergedValues.total : 0}</Typography>
                <Typography component="span" className={classes.val} style={{color:'#484646', fontSize:'1.25em'}}>${expense.mergedValues.total? Math.abs(expense.mergedValues.total-expense.mergedValues.average) : expense.mergedValues.average}</Typography>
                </div>
                <Divider style={{marginBottom:10}}/>
                </div>) 
              })}
            </div>
        </Card> 
    )
}

