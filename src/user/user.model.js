import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

export const userSchema = new Schema({
  _id: ObjectId,
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_image: { type: String, required: false },
  bio: { type: String, required: false },
  address: {
    street_name: { type: String, required: false },
    neighbourhood: { type: String, required: false },
    zip_code: { type: String, required: false },
    house_number: { type: String, required: false },
    city: { type: String, required: false },
    state_or_province: { type: String, required: false },
    country: { type: String, required: false },
  },
  score: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  completed_profile: { type: Boolean, default: false },
  confirmed_email: { type: Boolean, required: true, default: false },
})

export const UserModel = mongoose.model('User', userSchema)
