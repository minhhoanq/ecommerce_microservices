import { createClient } from "redis";

const client = createClient({
    password: "12092002",
    socket: {
        host: "redis-16933.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com",
        port: 16933,
    },
});

client.on("error", (err) =>
    console.log(`Redis Client Connection Error: ${err.message}`)
);

const connectionClient = async () => {
    try {
        await client.connect();
        console.log("Redis Client Connection Success.");
    } catch (error) {
        console.log(`Redis Client Connected Failed`);
    }
};

connectionClient();

export { client };
