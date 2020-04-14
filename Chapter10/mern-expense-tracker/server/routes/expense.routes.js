import express from 'express'
import expenseCtrl from '../controllers/expense.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/expenses/current/preview')
  .get(authCtrl.requireSignin, expenseCtrl.currentMonthPreview)

router.route('/api/expenses/by/category')
  .get(authCtrl.requireSignin, expenseCtrl.expenseByCategory)

router.route('/api/expenses/plot')
  .get(authCtrl.requireSignin, expenseCtrl.plotExpenses)

router.route('/api/expenses/category/averages')
  .get(authCtrl.requireSignin, expenseCtrl.averageCategories)

router.route('/api/expenses/yearly')
  .get(authCtrl.requireSignin, expenseCtrl.yearlyExpenses)

router.route('/api/expenses')
  .post(authCtrl.requireSignin, expenseCtrl.create)
  .get(authCtrl.requireSignin, expenseCtrl.listByUser)

router.route('/api/expenses/:expenseId')
  // .get(authCtrl.requireSignin, expenseCtrl.read)
  .put(authCtrl.requireSignin, expenseCtrl.hasAuthorization, expenseCtrl.update)
  .delete(authCtrl.requireSignin, expenseCtrl.hasAuthorization, expenseCtrl.remove)

router.param('expenseId', expenseCtrl.expenseByID)

export default router
