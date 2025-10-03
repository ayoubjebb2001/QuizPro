const Category = require('../Models/Category');

 
exports.listCategory = function(req, res) {
    Category.getAllCategories((err, categories) => {
        if (err) {
            return res.render("category", { categories: [], error: err.message });
        }
        res.render("category", { categories: categories, error: null });
    });
}

exports.newCategory = function(req, res) {
    const newCategory = {
        name: req.body.name,
        description: req.body.description
    };

    if (!newCategory.name) {
       
        return Category.getAllCategories((err, categories) => {
            res.render("category", { categories: categories || [], error: "Le champ 'nom' est requis" });
        });
    }

   
    Category.createCategory(newCategory, (err, result) => {
        if (err) {
            return Category.getAllCategories((err2, categories) => {
                res.render("category", { categories: categories || [], error: err.message });
            });
        }

   exports.newCategory = function(req, res) {
    const newCategory = {
        name: req.body.name,
        description: req.body.description
    };

    if (!newCategory.name) {
        // Si le nom est vide, on recharge la page avec message d'erreur
        return Category.getAllCategories((err, categories) => {
            res.render("category", { categories: categories || [], error: "Le champ 'nom' est requis" });
        });
    }

    // Ajouter la catégorie dans la BDD
    Category.createCategory(newCategory, (err, result) => {
        if (err) {
            return Category.getAllCategories((err2, categories) => {
                res.render("category", { categories: categories || [], error: err.message });
            });
        }

        // Après ajout, rediriger vers la liste pour voir la nouvelle catégorie
        res.redirect('/category');
    });
};

        res.redirect('/category');
    });
};
exports.updateCategory = async function(req, res) {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;

        if (!name) return res.status(400).json({ error: "Le champ 'nom' est requis" });

        await Category.updateCategoryAsync({ name, description }, categoryId);
        res.json({ message: "Catégorie mise à jour avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async function(req, res) {
    try {
        const categoryId = req.body.id;
        if (!categoryId) throw new Error("ID catégorie manquant");

        await Category.deleteCategoryAsync(categoryId);
        res.json({ message: "Catégorie supprimée avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
