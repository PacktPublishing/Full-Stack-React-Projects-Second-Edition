import Game from '../models/game.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res, next) => {
  const game = new Game(req.body)
  game.maker= req.profile
  try{
    let result = await game.save()
    res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({
    error: errorHandler.getErrorMessage(err)
    })
  }
}

const list = async (req, res) => {
  try {
    let games = await Game.find({}).populate('maker', '_id name').sort('-created').exec()
    res.json(games)
  } catch (err) {
    return res.status(400).json({
    error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByMaker = async (req, res) => {
  try {
    let games = await Game.find({maker: req.profile._id}).populate('maker', '_id name')
    res.json(games)
  } catch (err) {
    return res.status(400).json({
     error: errorHandler.getErrorMessage(err)
    })
  }
}

const gameByID = async (req, res, next, id) => {
  try { 
    let game = await Game.findById(id).populate('maker', '_id name').exec()
    if (!game)
      return res.status('400').json({
        error: "Game not found"
      })
    req.game = game
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve game"
    })
  }
}

const read = (req, res) => {
  return res.json(req.game)
}

const update = async (req, res) => {
  try {
  let game = req.game
  game = extend(game, req.body)
  game.updated = Date.now()
  await game.save()
    res.json(game)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let game = req.game
    let deletedGame = await game.remove()
    res.json(deletedGame)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isMaker = (req, res, next) => {
  let isMaker = req.game && req.auth && req.game.maker._id == req.auth._id
  if(!isMaker){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

const playGame = (req, res) => {
  res.sendFile(process.cwd()+'/server/vr/index.html')
}

export default {
  create,
  list,
  listByMaker,
  gameByID,
  read,
  update,
  remove,
  isMaker,
  playGame
}
