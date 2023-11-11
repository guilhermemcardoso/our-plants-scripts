import dotenv from 'dotenv'
import { connect as mongoConnect } from './src/services/mongodb.js'
import backup from './backups/2023-09-07.json' assert { type: 'json' }
import { capitalize } from './src/utils/formatters.js'
import SpecieService from './src/specie/specie.service.js'
import PlantService from './src/plant/plant.service.js'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

async function main() {
  try {
    console.time('Total spent')
    const userId = process.env.USER_ID
    await mongoConnect()
    let specieNames = []
    console.log('Reading backup file...')
    console.log('Getting specie names...')
    backup.forEach((plant) => {
      if (!specieNames.includes(plant.specie)) {
        if (plant.specie) {
          specieNames.push(plant.specie)
          console.log(plant.specie)
        }
      }
    })

    console.log('Found species:', specieNames.join())
    console.log('Getting species from database...')
    const species = await SpecieService.getAll()
    console.log('Existing species:', species.length)

    console.log('Comparing species to create the missing ones...')
    specieNames = specieNames.sort(function (a, b) {
      return a.localeCompare(b)
    })

    let createdSpecies = 0
    for await (const item of specieNames) {
      const specieName = capitalize(item)
      const alreadyExists =
        species.findIndex((specie) => specie.popular_name === specieName) >= 0
      if (!alreadyExists) {
        console.log('Creating new specie:', specieName)
        const specieObj = await SpecieService.create({
          item: { popular_name: specieName },
          userId,
        })
        createdSpecies += 1
        console.log('Created new specie:', specieObj.popular_name)
        species.push(specieObj)
      }
    }

    console.log('Found plants:', backup.length)
    console.log('Getting plants from database...')
    const plants = await PlantService.getAll()
    console.log('Existing plants:', plants.length)

    console.log('Comparing plants to create the missing ones...')

    let createdPlants = 0
    for await (const item of backup) {
      const foundPlantIndex = plants.findIndex((plant) => {
        return (
          plant.specie_id.popular_name === capitalize(item.specie) &&
          plant.location.coordinates[0] === item.location.coordinates[0] &&
          plant.location.coordinates[1] === item.location.coordinates[1]
        )
      })
      const alreadyExists = foundPlantIndex >= 0
      if (!alreadyExists) {
        console.log('Creating new plant:', item.specie)
        const specieId = species
          .find((specie) => specie.popular_name === capitalize(item.specie))
          ._id.toString()
        const plantObj = await PlantService.create({
          item: {
            description: item.description || '',
            specie_id: specieId,
            location: item.location,
          },
          userId,
        })
        createdPlants += 1
        console.log('Created new plant:', plantObj.specie_id._id.toString())
        plants.push(plantObj)
      } else {
        console.log('Already existing plant:', plants[foundPlantIndex]._id)
      }
    }

    console.log('---------------------------------')
    console.log('Created species: ', createdSpecies)
    console.log('Total species:', species.length)
    console.log('Created plants: ', createdPlants)
    console.log('Total plants:', plants.length)
    console.timeEnd('Total spent')
  } catch (err) {
    console.log('---------------------------------')
    console.log('Backup failed')
    console.log('Reason: ', err)
  }
}

main()
