import Redis from "ioredis"; 
Redis.default();

const codes  = new Redis(()=>{
    host : process.env.REDIX_HOST;
    port :  process.env.REDIX_PORT;
    password : process.env.REDIX_PASSWORD;
});

Redis.on("connect",()=>{
    console.log("Redis are connectd");
});

Redis.on("error",()=>{
    console.log(error);
});

export default codes ; 