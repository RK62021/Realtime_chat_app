const {redisPub} = require('../config/redis');

const publishMessage = async (channel, message) => {
    try {   
        await redisPub.publish(channel, message);
        console.log(`Message published to channel ${channel}`);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
};

module.exports = { publishMessage };