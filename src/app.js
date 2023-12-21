const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const mongoose = require("mongoose");
const filterRoutes = require("./routes/filter.routes");
const Filter = require("./models/filter");

require("dotenv").config();
fastify.register(cors, {
  origin: "*",
});

mongoose.set("strictQuery", false);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}${process.env.MONGO_DB_DB}/?retryWrites=true&w=majority`,
).then(() => {
  console.log("successfully connect to database mongodb")
}).catch(err => console.log(err))

fastify.register(require('@fastify/redis'), {
  host: '172.21.0.1',
  password: 'root',
  port: 6379,
});

//Routes mongoDB
fastify.register(filterRoutes, { prefix: "/filter" });

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// route pour récupérer les produits avec redis
fastify.get("/getProducts", async function (request, reply) {
  try {
    //recupérer la fouchette de prix dans les paramètres de la requête

    let { minPrice, maxPrice } = request.query;

    if (!minPrice || !maxPrice) {
      minPrice = 0;
      maxPrice = 1000000;
    }

    const randomProducts = [];
    const result = await fastify.redis.get("products");
    const products = JSON.parse(result);
    const filteredProducts = products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
    // si il n'y a pas assez de produits dans la fourchette de prix, on renvoit 3 produits aléatoires
    while (filteredProducts.length < 3) {
      const randomIndex = Math.floor(Math.random() * products.length);
      // on vérifie que le produit n'est pas déjà dans le tableau
      if (filteredProducts.includes(products[randomIndex])) {
        continue;
      }
      filteredProducts.push(products[randomIndex]);
    }
    if (filteredProducts.length === 3) {
      reply.send(filteredProducts);
    } else {
      while (randomProducts.length < 3) {
        const randomIndex = Math.floor(Math.random() * filteredProducts.length);
        // on vérifie que le produit n'est pas déjà dans le tableau
        if (randomProducts.includes(filteredProducts[randomIndex])) {
          continue;
        }
        randomProducts.push(filteredProducts[randomIndex]);
      }
      reply.send(randomProducts);
    }
  } catch (error) {
    console.log(error);
  }
});

fastify.get("/getAllProducts", async function (request, reply) {
  try {
    //recupérer la fouchette de prix dans les paramètres de la requête

    let { minPrice, maxPrice } = request.query;
    console.log(minPrice, maxPrice);

    if (!minPrice || !maxPrice) {
      minPrice = 0;
      maxPrice = 1000000;
    }

    const result = await fastify.redis.get("products");
    const products = JSON.parse(result);
    const filteredProducts = products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
    const newFilteredProducts = {
      minPrice: minPrice,
      maxPrice: maxPrice,
    }
    const filter = new Filter(newFilteredProducts);
    await filter.save();
    reply.send(filteredProducts);
  } catch (error) {
    console.log(error);
  }
});

// route pour récupérer les statistiques via le controller filter

// Run the server!
fastify.listen({ port: process.env.PORT }, function (error, address) {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
