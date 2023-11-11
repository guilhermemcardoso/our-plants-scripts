import mongoose from 'mongoose'

export async function connect() {
  const mongoUrl = process.env.MONGODB_URL
  try {
    await mongoose.connect(mongoUrl)
    console.log('[MONGODB]: connected to database')
  } catch (e) {
    console.error('[MONGODB]: Could not connect', e)
  }
}
