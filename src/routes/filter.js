const { getStats } = require("../controllers/getStats");
// route pour récupérer les statistiques stockées dans mongodb:

fastify.get("/getStats", getStats);