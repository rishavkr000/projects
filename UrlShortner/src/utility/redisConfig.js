const redis = require("redis");
const {promisify} = require("util");

//Connect to redis
const redisClient = redis.createClient(
    18571,
    "redis-18571.c305.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("tCGUrhIt5OIRiHtTbjWtsSu6R0SPCgJC", function (err) {
    if (err) throw err;
});
redisClient.on("connect", async function () {
    console.log("Connected to Redis....");
});

// Connection setup for redis
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


module.exports = { SET_ASYNC, GET_ASYNC }