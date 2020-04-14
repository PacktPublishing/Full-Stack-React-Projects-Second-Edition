import mongoose from 'mongoose'
import crypto from 'crypto'

const VRObjectSchema = new mongoose.Schema({
  objUrl: {
    type: String, trim: true,
    required: 'ObJ file is required'
  },
  mtlUrl: {
    type: String, trim: true,
    required: 'MTL file is required'
  },
  translateX: {type: Number, default: 0},
  translateY: {type: Number, default: 0},
  translateZ: {type: Number, default: 0},
  rotateX: {type: Number, default: 0},
  rotateY: {type: Number, default: 0},
  rotateZ: {type: Number, default: 0},
  scale: {type: Number, default: 1},
  color: {type: String, default: 'white'}
})
const VRObject = mongoose.model('VRObject',VRObjectSchema)

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  world: {
    type: String, trim: true,
    required: 'World image is required'
  },
  clue: {
    type: String,
    trim: true
  },
  answerObjects: [VRObjectSchema],
  wrongObjects: [VRObjectSchema],
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  maker: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

GameSchema.path('answerObjects').validate(function(v) {
  if (v.length == 0) {
    this.invalidate('answerObjects', 'Must add alteast one VR object to collect')
  }
}, null)
GameSchema.path('wrongObjects').validate(function(v) {
  if (v.length == 0) {
    this.invalidate('wrongObjects', 'Must add alteast one other VR object')
  }
}, null)
export default mongoose.model('Game', GameSchema)
