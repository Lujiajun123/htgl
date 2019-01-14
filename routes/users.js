let express = require('express');
let router = express.Router();
let multer = require("multer");
let token = require("../libs/token.js");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + "-" + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
var upload = multer({ storage: storage });

let { connect, insert, find, ObjectId, update, remove } = require("../libs/mongo");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/upload', upload.single("pic"),  (req, res, next) => {
  // let data2 = await update("list", [{ _id: req.body._id },{}]);
  res.send({
    status: "success",
    file: req.file.filename
  });
});

router.post('/login', async (req, res, next) => {
  let { inputEmail, inputPassword } = req.body;
  let data = await find(`account`, { account: inputEmail });
  try {
    if (data[0].password === inputPassword) {
      res.send({
        status: "success",
        token: token.createToken({
          inputEmail,
          inputPassword,
          age:432432,
          skill:"ps ae sex"
        }, 12000)
      });
    } else {
      res.send({ status: "fail" });
    }
  } catch{
    res.send({ status: "fail" });
  }
});

router.post('/update', async (req, res, next) => {
  let user = req.body.account;
  let data = await update(`account`, [{ account: user },{img:req.body.img}]);
  // res.send(data[0].head);
})

router.post('/headpic', async (req, res, next) => {
  let user = req.body.account;
  let data = await find(`account`, { account: user });
  // console.log(data);
  res.send(data[0].img);
})
// router.options('/autologin', (req, res, next) =>{
//   this.set('Access-Control-Allow-Method', 'POST,PUT,OPTIONS');
//   this.set('Access-Control-Allow-Origin', '*');
//   this.status = 204;
//   res.send("200");
// });
router.post('/autologin', (req, res, next) => {
  // res.set('Access-Control-Allow-Method', 'POST,PUT,OPTIONS');
  // res.set('Access-Control-Allow-Origin', '*');
  // console.log(req.headers);
  // console.log(req.body);
  // console.log(req);
  res.send({
    status: token.checkToken(req.headers.token),
    user:token.decodeToken(req.headers.token)
    // status:"200"
  })
})

module.exports = router;
