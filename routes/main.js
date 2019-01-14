let express = require('express');
let router = express.Router();

let { connect, insert, find, ObjectId, update, remove } = require("../libs/mongo");

/* GET users listing. */
router.get('/', async (req, res, next) => {
    // let {gid,name,type,brand,price}=req.query;
    console.log(req.query);
    if (req.query._id) {
        try {
            req.query._id = ObjectId(req.query._id);
        } catch{ }
    }
    if (req.query.price) {
        req.query.price = Number(req.query.price);
    }
    if (req.query.name) {
        req.query.name = '/' + req.query.name + '/';
        req.query.name = eval(req.query.name);
    }
    // console.log(req.query);
    let data = await find("list", req.query);
    // console.log(data);
    res.send(data);

});
router.post('/', async (req, res, next) => {
    var o = {};
    o.count = 0;
    for (let key in req.body) {
        let obj = { _id: req.body[key] };
        obj._id = ObjectId(obj._id);
        let data = await remove("list", { ...obj });
        // console.log(data.deletedCount);
        o.count += data.deletedCount;
    }
    let data = await find("list");
    o.data = data;
    res.send(o);
});

router.post('/change', async (req, res, next) => {
    if (req.body._id) {
            req.body._id = ObjectId(req.body._id);
    }
    if (req.body.price) {
        req.body.price = Number(req.body.price);
    }
    // let data1 = await find("list", { _id: req.body._id });
    // if (data1.length < 1) {
        let obj = {};
        let data2 = await update("list", [{ _id: req.body._id },
        { price: req.body.price, brand: req.body.brand, type: req.body.type }]);
        // res.send(data2);
        let data3 = await find("list", { _id: req.body._id });
        obj.count = data2.matchedCount;
        obj.data = data3;
        res.send(obj);
    // } else if (data1.length >=1) {
    //     res.send("exist");
    // }
});

module.exports = router;