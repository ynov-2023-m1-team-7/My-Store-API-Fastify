const Filter = require("../models/filter");


// route pour récupérer les statistiques stockées dans mongodb:

exports.getStats = (async function (request, reply) {
    try {
        // recupérer les données de mongodb
        const result = await Filter.find();
        // calculer le prix moyen de minPrice
        const minPriceAverage = result.reduce((acc, filter) => acc + filter.minPrice, 0) / result.length;

        // calculer le prix moyen de maxPrice
        const maxPriceAverage = result.reduce((acc, filter) => acc + filter.maxPrice, 0) / result.length;

        // calculer le prix moyen de tous les produits
        const averagePrice = (minPriceAverage + maxPriceAverage) / 2;

        // fourchettes de prix les plus utilisées
        const minPriceMostUsed = result.reduce((acc, filter) => {
            if (acc[filter.minPrice]) {
                acc[filter.minPrice]++;
            } else {
                acc[filter.minPrice] = 1;
            }
            return acc;
        }, {});

        // renvoyer les données au client
        reply.send({
            minPriceAverage,
            maxPriceAverage,
            averagePrice,
            minPriceMostUsed
        });
    } catch (error) {
        console.log(error);
    }
})

// route pour stocker les filtres dans mongodb
exports.storeFilter = (async function (request, reply) {
    try {
        const filter = new Filter(request.body);
        await filter.save();
        reply.send(filter);
    } catch (error) {
        console.log(error);
    }
})