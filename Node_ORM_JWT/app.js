const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const jwtConfig = require("./config/jwt-config")
const jwtMiddleware = require("./config/jwt-middleware")

const app = express();
const PORT = 8091;
app.use(bodyParser.json());

//to establish database
const sequelize = new Sequelize("orm_jwt", "root", "nishacrest123", {
  host: "localhost",
  dialect: "mysql",
});

//to authenticate details
sequelize
  .authenticate()
  .then((data) => {
    console.log("database successfully connected");
  })
  .catch((error) => {
    console.log(error);
  });

//define model here
var User = sequelize.define(
  "tbl_users",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
    modelName: "User",
  }
);

User.sync(); //sync this model to database

//user profile data
app.post("/profile", jwtMiddleware.checkToken, (req,res) => {
  res.status(200).json({
    status: 1,
    userdata: req.user,
    message: "Token value parsed"
  })
})

//validate token api
app.post("/validate", (req,res) => {
    let userToken = req.headers["authorization"]
    if(userToken){
            JWT.verify(userToken, jwtConfig.secret, (error,decoded) => {
                if(error){
                    res.status(500).json({
                        status: 0,
                        message: "Invalid token",
                        data: error
                    })
                }else{
                    res.status(200).json({
                        status: 1,
                        message: "token is valid",
                        data: decoded
                    })
                }
                
            })
    }else {
        res.status(500).json({
            status: 0,
            message: "please provide authentication token value"
        })
    }
})
// login user api
app.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compare(req.body.password, user.password)) {
          let userToken = JWT.sign(
            {
              email: user.email,
              id: user.id,
            },
             jwtConfig.secret,
            {
              expiresIn: jwtConfig.expiresIn,
              notBefore: jwtConfig.notBefore,
              audience: jwtConfig.audience,
              issuer: jwtConfig.issuer,
              algorithm: jwtConfig.alogorithm
            }
          );
          res.status(200).json({
            status: 1,
            message: "user LoggedIn successfully",
            token: userToken,
          });
        } else {
          //password didn't match
          res.status(500).json({
            status: 0,
            message: "wrong password",
          });
        }
      } else {
        res.status(500).json({
          status: 0,
          message: "user didn't exists",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//register user api
app.post("/user", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password, 10);
  let status = req.body.status;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (user) {
        res.status(200).json({
          status: 0,
          message: "user already exists",
        });
      } else {
        User.create({
          name: name,
          email: email,
          password: password, //hash value
          status: status,
        })
          .then((response) => {
            res.status(200).json({
              status: 1,
              message: "user created successfully",
            });
          })
          .catch((error) => {
            res.status(500).json({
              status: 0,
              message: "error creating user",
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

//define default route of welcome page
app.get("/", (req, res) => {
  res.status(200).json({
    status: 1,
    message: "welcome to home page",
  });
});
app.listen(PORT, () => {
  console.log("app is listening to PORT");
});
