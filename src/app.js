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
  console.log("successfully connect to database mongodb")
}).catch(err => console.log(err))

fastify.register(require('@fastify/redis'), {
  host: '127.0.0.1',
  password: 'root',
  port: 6379, // Redis port
})


// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// route pour récupérer les produits avec redis
fastify.get("/getProducts", async function (request, reply) {
  try {
    //recupérer la fouchette de prix dans les paramètres de la requête

    let { min, max } = request.query;

    if (!min || !max) {
      min = 0;
      max = 1000000;
    }

    const randomProducts = [];
    const result = await fastify.redis.get("products");
    const products = JSON.parse(result);
    const filteredProducts = products.filter(
      (product) => product.price >= min && product.price <= max
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

// route pour récupérer les statistiques via le controller filter






// Run the server!
fastify.listen({ port: process.env.PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})