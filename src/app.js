const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const mongoose = require("mongoose");
require("dotenv").config();
fastify.register(cors, {
  origin: "*",
});

mongoose.set("strictQuery", false);
//Refaire la connection avec mongoose
mongoose.connect(
  `mongodb://${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`
).then(() => {
  console.log("successfully connect to database")
}).catch(err => console.log(err))

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});


//refaire la route mais avec mongoose
// fastify.get("/getProducts", async function (request, reply) {
//   try {
//     const result = await Product.find({});
//     reply.send(result);
//   } catch (error) {
//     console.log(error);
//   }
// });

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
