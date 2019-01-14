let express = require('express');
let router = express.Router();

let { connect, insert, find, ObjectId, update, remove } = require("../libs/mongo");

/* GET users listing. */
router.post('/', async (req, res, next) => {
    if(req.body.price){
        req.body.price = Number(req.body.price);
    }
    let data1 = await find("list",{name:req.body.name});
    if(data1.length==0){
        let data2 = await insert("list",[{...req.body}]);
        res.send(data2);
    }else if(data1.length>0){
        res.send("exist");
    }
});


module.exports = router;