// @ts-check
import * as fs from 'fs'
import * as path from 'path'
import { exec as exec_ } from 'child_process'
import { promisify } from 'util'

const exec = promisify(exec_)
const LOCK_FILENAME = 'create-aeria-app.lock'

const main = async () => {
  if( !fs.existsSync(LOCK_FILENAME) ) {
    await exec('npm i dualist@latest @eslint-aeria/config@latest')
    await exec('npm i --workspace=api aeria@latest aeria-sdk@latest')
    await exec('npm i --workspace=web @aeria-ui/i18n-en@latest aeria-app-layout@latest aeria-ui@latest aeria-sdk@latest @eslint-aeria/config-ui@latest')

    await fs.promises.writeFile(LOCK_FILENAME, '')
  }

  if( fs.existsSync('.aeria') ) {
    if( fs.existsSync(path.join('api', '.aeria')) ) {
      for( const file of await fs.promises.readdir('.aeria') ) {
        await fs.promises.rename(path.join('.aeria', file), path.join('api', '.aeria', file))
      }
      await fs.promises.rm('.aeria', {
        recursive: true,
      })
    } else {
      await fs.promises.rename('.aeria', path.join('api', '.aeria'))
    }
  }

  if( fs.existsSync('.aeria-ui') ) {
    if( fs.existsSync(path.join('web', '.aeria-ui')) ) {
      for( const file of await fs.promises.readdir('.aeria-ui') ) {
        await fs.promises.rename(path.join('.aeria-ui', file), path.join('web', '.aeria-ui', file))
      }
      await fs.promises.rm('.aeria-ui', {
        recursive: true,
      })
    } else {
      await fs.promises.rename('.aeria-ui', path.join('web', '.aeria-ui'))
    }
  }

}

main()

