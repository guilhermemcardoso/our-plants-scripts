import mongoose from 'mongoose'
import { UserModel } from '../user/user.model.js'

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

export const specieSchema = new Schema({
  _id: ObjectId,
  popular_name: { type: String, required: true },
  scientific_name: { type: String, required: false },
  created_by: { type: ObjectId, ref: UserModel },
  icon: { type: String, required: false },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
})

export const SpecieModel = mongoose.model('Specie', specieSchema)

export default class Specie {
  static async create(data) {
    let newData = await new SpecieModel({
      _id: new ObjectId(),
      ...data,
    }).save()

    newData = await newData.populate({
      path: 'created_by',
      select: '-password',
    })
    return newData.toObject()
  }

  static async getAll() {
    const result = await SpecieModel.find({})
      .populate({ path: 'created_by', select: '-password' })
      .lean()

    return result
  }
}
