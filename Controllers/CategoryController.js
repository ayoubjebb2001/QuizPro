const Category = require('../Models/Category');

exports.listCategory = function(req, res) {
    Category.getAllCategories((err, categories) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!categories || categories.length === 0) {
            return res.status(200).json({ message: "Aucune catégorie trouvée" });
        }

        res.json(categories);
    });
}
