const isGuest = function(req,res,next) {
    if(!req.session || req.session.user == null){
        return next();
    }else {
        res.redirect('../home/')
    }
}

module.exports = isGuest;