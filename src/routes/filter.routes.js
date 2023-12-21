const fastify = require("fastify")({ logger: true });
const filterController = require("../controllers/filter.controller");

async function routes(fastify, options) {
    // route pour récupérer les statistiques stockées dans mongodb:
    fastify.get("/getStats", filterController.getStats);
    // route pour stocker les filtres dans mongodb
    fastify.post("/storeFilter", filterController.storeFilter);
}

module.exports = routes;
