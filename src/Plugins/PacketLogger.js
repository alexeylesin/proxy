const request = require('request');
const config = require('config-yml');

function handlePackets (client, proxy, localServerOptions, proxyOptions) {
  client.on('packet', (data, meta) => {
    if (config.modules.packetLogger === true) {
      const pcklogmsg = `[Packets] ${proxy.clients[client.id].username || "Неизвестный игрок"} отправил пакет ${meta.name} на сервере ${config.localServer.serverName} (${config.localServer.remoteServer}:${config.localServer.remotePort}) через локальный порт ${config.localServer.port}`
      console.log(pcklogmsg)
      if (config.vkBot.enable === true && config.vkBot.logLevel === 'full') {
        encoded_pcklogmsg = encodeURI(pcklogmsg)
        request(`https://api.vk.com/method/messages.send?access_token=${config.vkBot.token}&v=5.130&random_id=${random_number(1, 60000)}&user_id=${config.vkBot.user}&message=${encoded_pcklogmsg}`, (err, res, body) => {
          if (res) {
            console.info(`[VKbot] Сообщение "pcklogmsg" успешно отправлено, пользователь - ${config.vkBot.user}`)
          } if (err) {
            return console.info(`[VKbot] Ошибка отправки сообщения "pcklogmsg", пользователь - ${config.vkBot.user}`, err);
          }
        });
      }
    }
  });
}

module.exports = handlePackets
