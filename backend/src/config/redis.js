// src/config/redis.js
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

const redisPub = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

const redisSub = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redisPub.on('connect', () => console.log('📤 Redis Pub connected'));
redisSub.on('connect', () => console.log('📤 Redis Sub connected'));
redis.on('error', (err) => console.error('Redis error', err));
redisPub.on('error', (err) => console.error('Redis Pub error', err));
redisSub.on('error', (err) => console.error('Redis Sub error', err));

module.exports = { redis, redisPub, redisSub };
