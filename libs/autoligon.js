var token = require("./token.js");
module.exports = (req,res,next)=>{
    if(token.checkToken(req.headers.token)){
        return;
    }else{
        res.send({
            status:"token失效"
        })
    }
}