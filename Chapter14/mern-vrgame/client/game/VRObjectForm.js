import React, {useEffect, useState} from 'react'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  card: {
    marginRight:'12px',
    marginLeft: '12px',
    padding: '10px'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  numberField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 70
  }
}))

export default function VRObjectForm(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
    objUrl: '',
    mtlUrl: '',
    translateX: 0,
    translateY: 0,
    translateZ: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    color:'white'
  })
  useEffect(() => {
    if(props.vrObject && Object.keys(props.vrObject).length != 0){
      const vrObject = props.vrObject
      setValues({...values,
        objUrl: vrObject.objUrl,
        mtlUrl: vrObject.mtlUrl,
        translateX: Number(vrObject.translateX),
        translateY: Number(vrObject.translateY),
        translateZ: Number(vrObject.translateZ),
        rotateX: Number(vrObject.rotateX),
        rotateY: Number(vrObject.rotateY),
        rotateZ: Number(vrObject.rotateZ),
        scale: Number(vrObject.scale),
        color:vrObject.color
      })
    }
  }, [])
  const handleChange = name => event => {
    setValues({...values, [name]: event.target.value})
    props.handleUpdate(props.index, props.type, name, event.target.value)
  }
    return (
      <Card className={classes.card}>
        <TextField
          label=".obj url"
          value={values.objUrl}
          onChange={handleChange('objUrl')}
          className={classes.textField}
          margin="normal"
        /><br/>
        <TextField
          label=".mtl url"
          value={values.mtlUrl}
          onChange={handleChange('mtlUrl')}
          className={classes.textField}
          margin="normal"
        /><br/>
        <TextField
          value={values.translateX}
          label="TranslateX"
          onChange={handleChange('translateX')}
          type="number"
          className={classes.numberField}
          margin="normal"
        />
        <TextField
          value={values.translateY}
          label="TranslateY"
          onChange={handleChange( 'translateY')}
          type="number"
          className={classes.numberField}
          margin="normal"
        />
        <TextField
          value={values.translateZ}
          label="TranslateZ"
          onChange={handleChange('translateZ')}
          type="number"
          className={classes.numberField}
          margin="normal"
        /><br/>
        <TextField
          value={values.rotateX}
          label="RotateX"
          onChange={handleChange('rotateX')}
          type="number"
          className={classes.numberField}
          margin="normal"
        />
        <TextField
          value={values.rotateY}
          label="RotateY"
          onChange={handleChange('rotateY')}
          type="number"
          className={classes.numberField}
          margin="normal"
        />
        <TextField
          value={values.rotateZ}
          label="RotateZ"
          onChange={handleChange('rotateZ')}
          type="number"
          className={classes.numberField}
          margin="normal"
        /><br/>
        <TextField
          value={values.scale}
          label="Scale"
          onChange={handleChange('scale')}
          type="number"
          className={classes.numberField}
          margin="normal"
        />
        <TextField
          value={values.color}
          label="Color"
          onChange={handleChange('color')}
          className={classes.numberField}
          margin="normal"
        />
        <Button onClick={props.removeObject(props.type, props.index)}>
          <Icon style={{marginRight: '5px'}}>cancel</Icon> Delete
        </Button><br/>
     </Card>
     )
}

VRObjectForm.propTypes = {
  index: PropTypes.number.isRequired,
  vrObject: PropTypes.object.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  removeObject: PropTypes.func.isRequired
}

