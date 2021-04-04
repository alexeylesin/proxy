const request = require('request');
const config = require('config-yml');

function handleChat (client, proxy, localServerOptions, proxyOptions) {
  client.on('chat', (data, metadata) => {
    if (config.modules.chatLogger === true) {
      let split = data.message.split(' ')
      if (split[0].startsWith('/')) {
          const cmdlog = `[CommandLogger] ${proxy.clients[client.id].username} выполнил команду "${data.message}" на сервере ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
          console.info(cmdlog)
          if (config.vkBot.enable === true && config.vkBot.logLevel === 'messages' || config.vkBot.logLevel === 'full') {
            encoded_cmdlog = encodeURI(cmdlog)
            request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_cmdlog}`, (err, res, body) => {
              if (res) {
                console.info(`[VKbot] Сообщение "cmdlog" успешно отправлено, пользователь - ${config.vkBot.user}`)
              } if (err) {
                return console.info(`[VKbot] Ошибка отправки сообщения "cmdlog", пользователь - ${config.vkBot.user}`, err);
              }
            });
        }
      } else {
        if (config.modules.chatLogger === true) {
          const msglog = `[ChatLogger] ${proxy.clients[client.id].username} написал в чат "${data.message}" на сервере ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
          console.info(msglog)
          encoded_msglog = encodeURI(msglog)
          if (config.vkBot.enable === true && config.vkBot.logLevel === 'messages' || config.vkBot.logLevel === 'full') {
            request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_msglog}`, (err, res, body) => {
              if (res) {
                console.info(`[VKbot] Сообщение "msglog" успешно отправлено, пользователь - ${config.vkBot.user}`)
              } if (err) {
                return console.info(`[VKbot] Ошибка отправки сообщения "msglog", пользователь - ${config.vkBot.user}`, err);
              }
            });
          }
      }
    }
    }
    });
}

module.exports = handleChat
