import mongoose from 'mongoose'
const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Title is required'
  },
  category: {
    type: String,
    trim: true,
    required: 'Category is required'
  },
  amount: {
      type: Number,
      min: 0,
      required: 'Amount is required'
  },
  incurred_on: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  recorded_by: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

export default mongoose.model('Expense', ExpenseSchema)
