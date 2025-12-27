const {redisSub} = require('../config/redis');
const {getIOInstance} = require('../config/socket.config');

function initRedisSubscriber() {
  redisSub.subscribe('chat:message', (err) => {
    if (err) console.error('❌ Subscribe error', err);
  });

  redisSub.on('message', (channel, message) => {
    if (channel === 'chat:message') {
      const data = JSON.parse(message);
      const io = getIOInstance();

      io.to(`chat:${data.chatId}`).emit('message:new', data);
    }
  });

  console.log('📡 Redis subscriber initialized');
}

module.exports = initRedisSubscriber;