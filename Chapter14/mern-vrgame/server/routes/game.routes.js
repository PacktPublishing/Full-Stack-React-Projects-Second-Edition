import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import gameCtrl from '../controllers/game.controller'

const router = express.Router()

router.route('/api/games')
  .get(gameCtrl.list)

router.route('/api/games/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, gameCtrl.create)
  .get(gameCtrl.listByMaker)

router.route('/api/game/:gameId')
  .get(gameCtrl.read)

router.route('/api/games/:gameId')
  .put(authCtrl.requireSignin, gameCtrl.isMaker, gameCtrl.update)
  .delete(authCtrl.requireSignin, gameCtrl.isMaker, gameCtrl.remove)

router.route('/game/play')
  .get(gameCtrl.playGame)

router.param('gameId', gameCtrl.gameByID)
router.param('userId', userCtrl.userByID)

export default router
