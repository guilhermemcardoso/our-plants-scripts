import Specie from './specie.model.js'

export default class SpecieService {
  static async create({ item, userId }) {
    const data = {
      ...item,
      created_by: userId,
    }

    const specie = await Specie.create(data)

    return specie
  }

  static async getAll() {
    const species = await Specie.getAll()

    return species || []
  }
}
