'use strict'

import electron, { app, BrowserWindow, Menu } from 'electron'

import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

const version = electron.app.getVersion()

let template = [
  {
    label: '查看',
    submenu: [
      {
        label: '重载',
        role: 'reload'
      },
      {
        label: '放大',
        role: 'zoomin'
      },
      {
        label: '缩小',
        role: 'zoomout'
      },
      {
        label: '重置放大/缩小',
        role: 'resetzoom'
      },
      {
        label: '切换开发者工具',
        role: 'toggledevtools'
      }
    ]
  },
  {
    label: '转到',
    submenu: [
      {
        label: '主页',
        click: function(item, window) {
          window.webContents.send('index')
        }
      }
    ]
  },
  {
    label: '账号',
    role: 'account',
    submenu: [
      {
        label: '退出登录',
        click: function(item, window) {
          window.webContents.send('logout')
        }
      }
    ]
  },
  {
    label: '帮助',
    role: 'help',
    submenu: [
      {
        label: `Version ${version}`,
        enabled: false
      },
      {
        label: '检查更新',
        key: 'checkForUpdate',
        click: function() {
          autoUpdater.checkForUpdates()
        }
      },
      {
        label: '重启并安装更新',
        enabled: true,
        key: 'restartToUpdate',
        click: function() {
          autoUpdater.quitAndInstall()
        }
      },

      {
        label: '关于',
        click: function() {
          electron.shell.openExternal(
            'https://github.com/qidaizhe11/douban-group-search'
          )
        }
      }
    ]
  }
]

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL, {
    userAgent:
      'api-client/1 com.douban.frodo/4.18.0(99) Android/24 gemini Xiaomi MI 5  rom/miui6  network/wifi'
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
