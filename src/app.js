const fastify = require("fastify");
const cors = require("@fastify/cors");
require("dotenv").config();
fastify.register(cors, {
  origin: "*",
});

fastify.register(require("@fastify/mongodb"), {
  url: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@${process.env.MONGODB_URL}/?retryWrites=true&w=majority`,
});

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// Run the server!
fastify.listen(
  { port: process.env.PORT, host: "127.0.0.1" },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
);
