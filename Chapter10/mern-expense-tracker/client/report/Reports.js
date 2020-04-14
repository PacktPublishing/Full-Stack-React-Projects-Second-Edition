import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import CategoryPie from './CategoryPie'
import YearlyBar from './YearlyBar'
import MonthlyScatter from './MonthlyScatter'

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    maxWidth: '800px',
    margin: 'auto',
    marginTop: 40,
    marginBottom: 40
  },
  separator: {
      marginBottom: 36
  }
}))

export default function Reports() {
    const classes = useStyles()
    return (
      <div className={classes.root}>
        <MonthlyScatter /> 
        <Divider className={classes.separator}/>
        <YearlyBar/>
        <Divider className={classes.separator}/>
        <CategoryPie/>
        </div>
    )
}