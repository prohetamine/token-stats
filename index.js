const path                  = require('path')
    , AppChannel            = require('node-mermaid/store/app-channel')()
    , AppTransportChannel   = require('node-mermaid/store/app-transport-channel')()
    , parser                = require('node-mermaid/parser')

AppChannel.on('connect', () => {
  const writeStat = data => {
    if (data.isEasyData) {
      if (data.easyData.events.isTokens) {
        AppTransportChannel.writeData({
          type: 'tip-message',
          data: {
            color: data.extension.color,
            platform: data.extension.platform,
            modelUsername: data.extension.modelUsername,
            windowId: data.extension.windowId,
            localDate: data.extension.localDate,
            tokenCount: data.easyData.tokenCount
          }
        })
      }
    }
  }

  AppTransportChannel.on('connect', () => {
    AppChannel.on('data', data => {
      parser.Chaturbate(data, writeStat)
      parser.xHamsterLive(data, writeStat)
      parser.Stripchat(data, writeStat)
      parser.BongaCams(data, writeStat)
    })

    AppChannel.on('reload', () => {
      AppTransportChannel.writeData({
        type: 'reload'
      })
    })
  })
})
