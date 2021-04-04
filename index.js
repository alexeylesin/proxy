module.exports.Proxy = require('./src/Proxy.js')
module.exports.createProxy = require('./src/createProxy.js')

const createProxy = require('./src/createProxy.js')
const request = require('request');
const config = require('config-yml');

global.random_number = function random_number(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

/*
  СОЗДАНИЕ ПРОКСИ
*/

let localServerOptions = {
  'port': config.localServer.port,
  'online-mode': false,
  'encryption': false,
  'motd': config.localServer.motd
}

let serverList = {
  remoteServer: {
    name: config.localServer.serverName,
    host: config.localServer.remoteServer,
    port: config.localServer.remotePort,
    isDefault: true,
    isFallback: true
  }
}

let proxyOptions = {
  enablePlugins: true
}

let proxy = createProxy(localServerOptions, serverList, proxyOptions)

/*
  ИВЕНТЫ ПОДКЛЮЧЕНИЙ
*/

proxy.on('error', console.error)

proxy.on('listening', () => {
  const listmsg = `[Proxy] Локальный прокси запущен на порту ${config.localServer.port}, MOTD - "${config.localServer.motd}", проксируется сервер ${config.localServer.serverName}`
  console.info(listmsg)
  if (config.vkBot.enable === true && config.vkBot.logLevel === 'full') {
    encoded_listmsg = encodeURI(listmsg)
    request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_listmsg}`, (err, res, body) => {
      if (res) {
        console.info(`[VKbot] Сообщение "listmsg" успешно отправлено, пользователь - ${config.vkBot.user}`)
      } if (err) {
        return console.info(`[VKbot] Ошибка отправки сообщения "listmsg", пользователь - ${config.vkBot.user}`, err);
      }
    });
  }
})

proxy.on('login', (player) => {
  const loginmsg = `[Connector] ${player.username} подключен с айпи ${player.socket.remoteAddress} на сервер ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
  console.info(loginmsg)
  if (config.vkBot.enable === true && config.vkBot.logLevel === 'full') {
    encoded_loginmsg = encodeURI(loginmsg)
    request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_loginmsg}`, (err, res, body) => {
      if (res) {
        console.info(`[VKbot] Сообщение "loginmsg" успешно отправлено, пользователь - ${config.vkBot.user}`)
      } if (err) {
        return console.info(`[VKbot] Ошибка отправки сообщения "loginmsg", пользователь - ${config.vkBot.user}`, err);
      }
    });
  }

  player.on('end', () => {
    const endmsg = `[Connector] ${player.username} завершил соединение с сервером ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
    console.info(endmsg)
    if (config.vkBot.enable === true && config.vkBot.logLevel === 'full') {
      encoded_endmsg = encodeURI(endmsg)
      request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_endmsg}`, (err, res, body) => {
        if (res) {
          console.info(`[VKbot] Сообщение "endmsg" успешно отправлено, пользователь - ${config.vkBot.user}`)
        } if (err) {
          return console.info(`[VKbot] Ошибка отправки сообщения "endmsg", пользователь - ${config.vkBot.user}`, err);
          process.exit(0);
        }
      });
    }
  })

  player.on('error', (err) => {
    const errmsg = `[Connector] ${player.username} отключен с сервера ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
    console.error(errmsg)
    if (config.vkBot.enable === true && config.vkBot.logLevel === 'full') {
      encoded_errmsg = encodeURI(errmsg)
      request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_errmsg}`, (err, res, body) => {
        if (res) {
          console.info(`[VKbot] Сообщение "errmsg" успешно отправлено, пользователь - ${config.vkBot.user}`)
        } if (err) {
          return console.info(`[VKbot] Ошибка отправки сообщения "errmsg", пользователь - ${config.vkBot.user}`, err);
        }
      });
    }
  })
})

proxy.on('moveFailed', (err, playerId, oldServerName, newServerName) => {
  const mvfailmsg = `[Connector] ${proxy.clients[playerId].username} с айпи ${proxy.clients[playerId].socket.remoteAddress} не смог переместиться из ${oldServerName} на ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
  console.error(mvfailmsg)
  if (config.vkBot.enable === true && config.vkBot.logLevel === 'full') {
    encoded_mvfailmsg = encodeURI(mvfailmsg)
    request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_mvfailmsg}`, (err, res, body) => {
      if (res) {
        console.info(`[VKbot] Сообщение "mvfailmsg" успешно отправлено, пользователь - ${config.vkBot.user}`)
      } if (err) {
        return console.info(`[VKbot] Ошибка отправки сообщения "mvfailmsg", пользователь - ${config.vkBot.user}`, err);
      }
    });
  }
})

proxy.on('playerMoving', (playerId, oldServerName, newServerName) => {
  const plmvmsg = `[Connector] ${proxy.clients[playerId].username} с айпи ${proxy.clients[playerId].socket.remoteAddress} подключается к серверу ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
  console.info(plmvmsg)
  if (config.vkBot.enable === true && config.vkBot.logLevel === 'full') {
    encoded_plmvmsg = encodeURI(plmvmsg)
    request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_plmvmsg}`, (err, res, body) => {
      if (res) {
        console.info(`[VKbot] Сообщение "plmvmsg" успешно отправлено, пользователь - ${config.vkBot.user}`)
      } if (err) {
        return console.info(`[VKbot] Ошибка отправки сообщения "plmvmsg", пользователь - ${config.vkBot.user}`, err);
      }
    });
  }
})

proxy.on('playerMoved', (playerId, oldServerName, newServerName) => {
  const plmvdmsg = `[Connector] ${proxy.clients[playerId].username} с айпи ${proxy.clients[playerId].socket.remoteAddress} подключился к серверу ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
  console.info(plmvdmsg)
  if (config.vkBot.enable === true && config.vkBot.logLevel === 'full') {
    encoded_plmvdmsg = encodeURI(plmvdmsg)
    request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_plmvdmsg}`, (err, res, body) => {
      if (res) {
        console.info(`[VKbot] Сообщение "plmvdmsg" успешно отправлено, пользователь - ${config.vkBot.user}`)
      } if (err) {
        return console.info(`[VKbot] Ошибка отправки сообщения "plmvdmsg", пользователь - ${config.vkBot.user}`, err);
      }
    });
  }
})

proxy.on('playerFallback', (playerId, oldServerName, newServerName) => {
  const plfbmsg = `[Connector] ${proxy.clients[playerId].username} с айпи ${proxy.clients[playerId].socket.remoteAddress} был перемещен из ${oldServerName} на ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
  console.info(plfbmsg)
  if (config.vkBot.enable === true && config.vkBot.logLevel === 'full') {
    encoded_plfbmsg = encodeURI(plfbmsg)
    request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_plfbmsg}`, (err, res, body) => {
      if (res) {
        console.info(`[VKbot] Сообщение "plfbmsg" успешно отправлено, пользователь - ${config.vkBot.user}`)
      } if (err) {
        return console.info(`[VKbot] Ошибка отправки сообщения "plfbmsg", пользователь - ${config.vkBot.user}`, err);
      }
    });
  }
})
