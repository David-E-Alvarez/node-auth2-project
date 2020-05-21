//?
const router = require("express").Router();

//importing bcrypt for hashing password
const bcrypt = require("bcryptjs");
//JSON web token
const jwt = require("jsonwebtoken");
//isValid
const { isValid } = require("../users/users-service.js");
//helper functions
const Users = require("./users-model.js");

router.get("/", (req, res) => {
  Users.find()
    .then((users) => {
      console.log("users: ", users);
      res.status(201).json(users);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/register", (req, res) => {
  const user = req.body;
  if (isValid(user) && user.department) {
    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;
    Users.add(user)
      .then((user) => {
        // console.log("user: ", user);
        res.status(201).json(user);
      })
      .catch((error) => {
        console.log("error: ", error);
        res.status(500).json(error);
      });
  } else {
    res.status(400).json({ message: "couldnt register user" });
  }
});

//login
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (isValid(req.body)) {
      Users.findBy({ username })
        .then(([user]) => {
          if (user && bcrypt.compareSync(password, user.password)) {
            const token = createToken(user);
            res.status(200).json({ username: user.username, token });
          } else {
            res.status(401).json({ errorMessage: "Invalid Credentials" });
          }
        })
        .catch((err) => {
          res.status(500).json({ errorMessage: "there was an error",error:err.message });
        });
    } else {
      res.status(400).json({ errorMessage: "Please provide username, password" });
    }
  });


router.get('/users', restrict, (req,res) => {
  Users.find()
    .then(user => {
      res.status(201).json(user)
    })
    .catch(error => {
      res.status(400).json(error)
    })
})

function createToken(user) {
  const payload = {
    user: user.username,
    department: user.department,
  };
  const options = {
    expiresIn: "1h",
  };
  const secret = 'very secret secret';
  return jwt.sign(payload, secret,options);
}

function restrict(req,res,next){
  const token = req.headers.authorization;
  if(token){
    jwt.verify(token, 'very secret secret', (err,decodedToken)=>{
      if(err){
        res.status(401).json({message: "invalid token"})
      }else{
        req.subject = decodedToken.subject;
        req.username = decodedToken.username;
        next();
      }
    })
  }else{
    res.status(401).json({message: "you shall not pass!"})
  }
}

module.exports = router;
