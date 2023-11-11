import Plant from './plant.model.js'

export default class PlantService {
  static async create({ item, userId }) {
    const data = {
      ...item,
      created_by: userId,
    }

    const plant = await Plant.create(data)

    return plant
  }

  static async getAll() {
    const plants = await Plant.getAll()

    return plants || []
  }
}
