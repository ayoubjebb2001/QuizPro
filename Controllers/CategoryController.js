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
exports.newCategory= function(req,res){

const newCategory = {
    name: req.body.name,
    description: req.body.description
};
 if(!newCategory.name ){
return res.status(400).json({ error: "Le champ 'nom' est requis" });

    }
 Category.createCategory(newCategory,(err,result)=>{
if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
    message: "Catégorie créée", 
    id: result.insertId, 
    data: newCategory 
});


    
 })
 
}
exports.updateCategory= function(req,res){


    const infoCatego={name:req.body.name,description:req.body.description};
    const categoryid=req.params.id;
    if(!infoCatego.name){
    return res.status(400).json({ error: "Le champ 'nom' est requis" });    
    }
    Category.updateCategory(infoCatego,categoryid,(err,result)=>{

if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
    message: "Catégorie updated ", 
    id: categoryid, 
    data: infoCatego 
});

    })
}