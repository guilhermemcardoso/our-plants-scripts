import dotenv from 'dotenv'
import { connect as mongoConnect } from './src/services/mongodb.js'
import { capitalize } from './src/utils/formatters.js'
import SpecieService from './src/specie/specie.service.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

async function main() {
  try {
    console.time('Total spent')
    const userId = process.env.USER_ID
    await mongoConnect()
    let specieIcons = []
    console.log('Reading icon files...')

    const directoryPath = path.join(__dirname, 'src/specie-icons')

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err)
      }

      files.forEach(function (file) {
        if (file.includes('.png')) {
          specieIcons.push(file.toString().replace('.png', ''))
        }
      })
    })

    console.log('Getting species from database...')
    const species = await SpecieService.getAll()
    console.log('Existing species:', species.length)

    console.log('Comparing species to create the missing ones...')

    let missingIcons = []
    for await (const item of species) {
      let specieName = ''
      const alreadyExists =
        specieIcons.findIndex((specie) => specie === item._id.toString()) >= 0
      if (!alreadyExists) {
        missingIcons.push({
          id: item._id.toString(),
          name: item.popular_name,
        })
      }
    }

    console.log('Missing icons:')
    missingIcons.forEach((missingIcon) => console.log(missingIcon))

    console.log('---------------------------------')
    console.log('Missing icons: ', missingIcons.length)
    console.log('Existing icons:', species.length - missingIcons.length)
  } catch (err) {
    console.log('---------------------------------')
    console.log('Backup failed')
    console.log('Reason: ', err)
  }
}

main()
