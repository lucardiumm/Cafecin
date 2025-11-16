import { app, BrowserWindow, Menu, nativeImage, powerSaveBlocker, Tray } from 'electron';
import path from 'path'
import fs from 'fs'

const userPath = app.getPath('userData')
const timeFilePath = path.join(userPath, '/Time.me')

const writeTime = (time: number) => {
  fs.writeFileSync(timeFilePath, time.toString())
}

if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => {
  writeTime(15 * 60 * 1000)

  var isFilled = false
  var time = parseInt(fs.readFileSync(timeFilePath, 'utf8'))
  var id = 0

  app.dock.hide()

  const white = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAoCAYAAACFFRgXAAADtElEQVR42u3Ya4iNWxzHcfsyM27NuHTMIJciTW51TkQHiRjFvEHInfIGw2mO80IpJYOUlPulvHFLMSHXxt3IdXIraYSZ5EhO03Z0BtHe2/fFb2m1jsdqeOy82P/69FzXev57Pf9nPc9Ms2xkIxvZyEY2MhrpdDoiUZc59jMkGEVcor7zEdO5sYz9CCUZQzSEvmISfuJmhJx9cfTFVKzEHlThBmqkGkexFeUYhaL/DQLCHtWItf0rKnAbH2HiLV7gMWrxCPVoQAomXqES05Bvj7hd999826z1fjgAE8+wH4sxGr1RhALkSzt0w0BMxhpUWz/0MRYgHlDz0W9Ndj7e6yInMQHtv6O8+mEFXqrPM+gVdIeblGwymVymTutR6nkY466gh0vtCrHF6n8HNmIeOtv9e6csrZeqszvo5CYo/ppTv3Y759jCtCKVSiW12oA/Eflq0qonk9R5JNFf+3LCmorUf661vVmJLsMs1Gl7g3PnrVBSWnZFAsedBmFPmc21HIYklms7H2eU9Az7TgUl3AP/4UiGEv5dyW3SIZNDI65YpREPSrgL/qGmEiyLtS8X8RBfRnnW9molvMI5rwp1aONL+BfU6EE4aaYx08jUc5OTVFvnZTQd75RwmZsw169LJBIBCWuHOq2EifsYGvBNkOOIB+yLOG1bYyVMvMN463gXvEG1UxKBL4wKdXQW/2p9N0ag5XeUQ3cswhP1eRX13MpXmpHMeTt1fI47JweN8kikeXls1jfEaZi4i42YiUHohgLkIUdaqrSKUYK/cAQJ9fEaZRiiATll5bBW5xxFzB3Mr5XFNbxFkfaNxXY8hYmPeImHqNGIXcc9nfcGJhpxAeXorD5X6VgpCnFM25dR6CTrfdtNUuP9zjltMRyLsY0H4wTLW0q6lu1a1f0lHFBSU1Ds9DMAjXiOnbR7revtQjuTrF3/vlGO4LA6metpk4PWyJcWnvPb4hzsuImJnrnfm3RPvFCHJab4lVy8KfMuWlnbe9XnA2zFRPtHevr2lsZwnuL3KYL1Sc60pgctUK7z3VCAg0p2Hzq6AwX/yPq+RzWdNehC61EUMC8LbZ3QbPHAqtNcO1F3VMNIug8uIq0yWY4+nvYFGMfNMc9CCkus43nWiIb/t50uUIZ6JfAB11SHS/EHylGBQ6iDiUr85qnT8P961nZ7zMZh/I0vRSPuYB0Gq+mPT9Z3IfZ1wCCUyBiMRDHy3PYqs8yF9Z+fSBPaxDI0qv5PRom57GM/7T8GPy+zQRCfAFeITV6ZyaPqAAAAAElFTkSuQmCC')
  const whiteFilled = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAoCAYAAACFFRgXAAAFEElEQVR42u2Zf2hWVRjHe39sr9PV1DQdpkkukZaTZKIQFEotZv5RjBFRZvaDiFaxCSX9cn+sXyBRZmkDS6LSKDPth+XslybaTxFcMIetxEYmsSzX3Hzf+/a59L3xcHhv17n31X964LNzzr33nPOc5zz3ec59d1Y+JZvNxqAI4jTPvKBI0idMWacdD3kuAUV5U2qIypTAVEiE9IvZuk9BlZUy5bmspvIi6ICm/1js+VBh7+db4bipvwLbYZTaSfuMXOYDz/MOU5YH95wxlsABmGHGyKtYCy4EXxocRWPmmSYUHqCsNH1tWQ1HYW0hrTxM5WT4HR43isYhYba7G7bmWGyxufYttNldzLt1VV8LvTDLuID18efhT6g2fV23uhd8uaUgLhGEIMoa6INmaxnHLTpwh4/sYh1fvwAOwib7TKH8dxkch+mOm8Qhpvozsl69iblxo3Ct7i9UO1WQZKFyDvTD28aqKcfK58BquNbZhZTq5dCZ9bL7Kcea8QsWh++GJyAxhPGuhFaYXDCFNaiboi+BG6AFXoNt8A3shi9hJ2yGVdAIV8E4N8bnO0LEHQvPgGbYAx4E0qdwtp+XrtMvoQt+yxpReyPUQ6lzvoiLWD7C2XRYB4H8BC/BYpil+FsKxYZhMFrpugYehk8gozF+gLty7F4sWMApKatB+zXJZvlgCaSgIp1O1+qZFlihl+4FWA5L5TazYYwUmQT3wy8asw2mhu3wYJV90Fh0nq5VwZPwtbLeyUgaDsodbtaCh2uBWbnPi2rfDhMilbapVvUFGmwvlGmClzV5bvG8f/5SRkgn1GmeO0HdvYzx9SaIhSrtnr7gY3WugCTstqpp8LSP6mGkA9S2cofmW6n2Q9qBLrWfdXY+NA1P0na/Z46EgZwATwxO1A/pU/tH7VyV2o+YBNSmazdZDwhT+ELohXfUfkCdM9CvrT9VycAx1Q8pulys9nNGlynS4QvjGskwhSfCEfhD9eGw15l0QKTVdn3X86/o/gkYUGnlPs33mNrNjj5b5R4joxQeq6zlyxbF1THMvzHCcmnHr8O2ohtu1Vz1OvD70uAqzL2unp6eUIWTgeKwAQLZZz5p5kIrA32v09vJyhH6bPOtag4+y5xseZ3RZaJ2eIfjEqExuMUE9qOQzWQya5T14jBSWe5Gvd0rFPbe0NmiVfH6Hpiv9yKpF2qRbzmNv1Mv369QZeZvtQd9G97CrDxPSq6kuBQ+hEC+k9/VwhQpn4KE3CcpRsA4mAm3wfpg8Sob4DLVtxgdntIzm5xvQkm4W+yCv2C8rs2H1bKIlcPQrlj9OezQog7AMWfbP4VGmOC8cAu0uHfV3u63HWUjs129Or9un5FFL9d2r4L39ZJ2QKfYp0nXS6nrYZozTrVC1yG9F0GqXwOjA2Vt/I2ycgyCyLA46tsPSuWjZ0NJxPOjlE2tfAV1Ed97kUpXQLcGrDGpuxSSg/gISMEI035VY7brdFdnFxkxdqRrXEESOK7MUG8tIEWKQtH52PQpgzchq2hS7hoKEvn4mWqu+YJ4GsbnOpoa4jnu10C78dPiiF9Gh6x0JXxmstWjUBnRvwyuMVnSgyXmfspYNP/fdpqgwYS2AdglP1yqTNaoxPMWdEEgG2CmtWpBfyN2MuG5sEhR5GfIJb2wB5bDHHUtvLJRE3HtPJgNNeJqZcppkHL7n/Z/KchFkhAbzIftabJq9I8sIpGDZFSYOuML+Lf8XxDkbweQPJzMPHKgAAAAAElFTkSuQmCC')
  const tray = new Tray(white.resize({ width: 24, quality: 'best' }))

  tray.setIgnoreDoubleClickEvents(true)
  tray.on('click', () => {
    isFilled = !isFilled
    tray.setImage(isFilled ? whiteFilled.resize({ width: 24, quality: 'best' }) : white.resize({ width: 24, quality: 'best' }))

    if (isFilled && time > 0) {
      id = powerSaveBlocker.start('prevent-display-sleep')
      setTimeout(() => {
        powerSaveBlocker.stop(id)
        isFilled = false
      }, time)
    } else if (isFilled && time === 0) {
      id = powerSaveBlocker.start('prevent-display-sleep')
    } else {
      powerSaveBlocker.stop(id)
      isFilled = false
    }
  })
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Set time',
      type: 'submenu',
      submenu: [
        {
          label: '15 minutes',
          type: 'radio',
          checked: time === 15 * 60 * 1000,
          click: () => {
            time = 15 * 60 * 1000
            writeTime(time)
          }
        },
        {
          label: '30 minutes',
          type: 'radio',
          checked: time === 30 * 60 * 1000,
          click: () => {
            time = 30 * 60 * 1000
            writeTime(time)
          }
        },
        {
          label: '45 minutes',
          type: 'radio',
          checked: time === 45 * 60 * 1000,
          click: () => {
            time = 45 * 60 * 1000
            writeTime(time)
          }
        },
        {
          label: '1 hour',
          type: 'radio',
          checked: time === 1 * Math.pow(60, 2) * 1000,
          click: () => {
            time = 1 * Math.pow(60, 2) * 1000
            writeTime(time)
          }
        },
        {
          label: '2 hours',
          type: 'radio',
          checked: time === 2 * Math.pow(60, 2) * 1000,
          click: () => {
            time = 2 * Math.pow(60, 2) * 1000
            writeTime(time)
          }
        },
        {
          label: 'Indefinitely',
          type: 'radio',
          checked: time === 0,
          click: () => {
            time = 0
            writeTime(time)
          }
        }
      ],
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
  }
});
