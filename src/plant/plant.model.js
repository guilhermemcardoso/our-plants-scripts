import mongoose from 'mongoose'
import { SpecieModel } from '../specie/specie.model.js'
import { UserModel } from '../user/user.model.js'

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

export const plantSchema = new Schema({
  _id: ObjectId,
  description: { type: String, required: false },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  images: { type: [String], required: false },
  created_by: { type: ObjectId, required: true, ref: UserModel },
  upvotes: [{ type: String }],
  downvotes: [{ type: String }],
  specie_id: { type: ObjectId, ref: SpecieModel, required: true },
  reported: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
})

plantSchema.index({ location: '2dsphere' })

export const PlantModel = mongoose.model('Plant', plantSchema)

export default class Plant {
  static async create(data) {
    let newData = await new PlantModel({
      _id: new ObjectId(),
      ...data,
    }).save()

    newData = await newData.populate([
      { path: 'created_by', select: '-password' },
      { path: 'specie_id' },
    ])
    return newData.toObject()
  }

  static async getAll() {
    const result = await PlantModel.find({})
      .populate([
        { path: 'created_by', select: '-password' },
        { path: 'specie_id' },
      ])
      .lean()

    return result
  }
}
