import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import {read, listRelated} from './api-media.js'
import Media from './Media'
import RelatedMedia from './RelatedMedia'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  toggle: {
    float: 'right',
    marginRight: '30px',
    marginTop:' 10px'
  }
}))

export default function PlayMedia(props) {
  const classes = useStyles()
  let [media, setMedia] = useState({postedBy: {}})
  let [relatedMedia, setRelatedMedia] = useState([])
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({mediaId: props.match.params.mediaId}, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setMedia(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [props.match.params.mediaId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listRelated({
      mediaId: props.match.params.mediaId}, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setRelatedMedia(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [props.match.params.mediaId])

  const handleChange = (event) => {
   setAutoPlay(event.target.checked)
  }
  const handleAutoplay = (updateMediaControls) => {
    let playList = relatedMedia
    let playMedia = playList[0]
    if(!autoPlay || playList.length == 0 )
      return updateMediaControls()
   
    if(playList.length > 1){
      playList.shift()
      setMedia(playMedia)
      setRelatedMedia(playList)
    }else{
      listRelated({
          mediaId: playMedia._id}).then((data) => {
            if (data.error) {
             console.log(data.error)
            } else {
              setMedia(playMedia)
              setRelatedMedia(data)
            }
         })
    }
  }
  //render SSR data
    if (props.data && props.data[0] != null) {
          media = props.data[0]
          relatedMedia = []
    }

    const nextUrl = relatedMedia.length > 0
          ? `/media/${relatedMedia[0]._id}` : ''
    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={8} sm={8}>
            <Media media={media} nextUrl={nextUrl} handleAutoplay={handleAutoplay}/>
          </Grid>
          {relatedMedia.length > 0
            && (<Grid item xs={4} sm={4}>
                    <FormControlLabel className = {classes.toggle}
                        control={
                          <Switch
                            checked={autoPlay}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label={autoPlay ? 'Autoplay ON':'Autoplay OFF'}
                    />
                  <RelatedMedia media={relatedMedia}/>
                </Grid>)
           }
        </Grid>
      </div>)
  }

