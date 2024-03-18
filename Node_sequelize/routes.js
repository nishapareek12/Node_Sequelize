const express = require("express")
const router = express.Router()
const Sequelize =  require("sequelize")
//connection with mysql database
const sequelize = new Sequelize("node_orm","root", "nishacrest123", {
    host: "localhost",
    dialect: "mysql"
})
//check database connection
sequelize.authenticate().then((success) => {
   console.log("successfully we are connected with database")
}).catch((error) => {
    console.log(error)
})

//craete model - first way to create model in sequelize
//1st parameter: table name
//2nd para: attributes and columns with their datatypes

var User = sequelize.define("tbl_users",{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING
    },
    rollNo: {
        type: Sequelize.INTEGER
    },
    status: {
        type: Sequelize.ENUM("1","0"),
        defaultValue: "1"
    },
    created_at: {
        type: Sequelize.DATE(),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    updated_at: {
        type: Sequelize.DATE(),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    }
}, {
    modelName: "User",
    timestamps: false
})

//sync model
sequelize.sync();

//create some data to table

router.post("/user", (req,res) => {
    // console.log(req.body);
    // return false;
    //here User is name of model
    // user.create({
    //     name: "nisha pareek",
    //     email: "nisha@gmail.com",
    //     rollNo: 23,
    //     status: 1
    // }).then((response) => {
    //     res.status(200).json({
    //         status: 1,
    //         message: "user has been created successfully"
    //     })
    // }).catch((error) => {
    //     console.log(error);
    // })

    User.create(req.body).then((response) => {
        res.status(200).json({
            status: 1,
            message: "user has been created"
        })
    }).catch((error) => {
        console.log(error)
    })
})

//Bulk create method
router.post("/bulk-user", (req,res) => {
User.bulkCreate([
    {
        name: "user1",
        email: "user1@gmail.com",
        rollNo: 53,
        status: 1
    },
    {
        name: "user2",
        email: "user2@gmail.com",
        rollNo: 58,
        status: 1
    },
    {
        name: "user3",
        email: "user3@gmail.com",
        rollNo: 73,
        status: 1
    },
    {
        name: "user4",
        email: "user4@gmail.com",
        rollNo: 13,
        status: 1
    }
]).then((response) => {
    res.status(200).json({
        status: 1,
        message: "User has been created"
    })
}).catch((error) => {
    console.log(error)
})
})

//findall api method
router.get("/users", (req,res) => {
    User.findAll().then((users) => {
        res.status(200).json({
            status: 1,
            message: "users found!",
            data: users
        })
    }).catch((error) => {
        console.log(error)
    })
})

//raw queries to select data
router.get("/user-raw", (req,res) => {
    sequelize.query("SELECT * FROM tbl_users", {
        type: sequelize.QueryTypes.SELECT
    }).then((response) => {
        res.status(200).json({
            status: 1,
            message: "users found",
            data: response
        })
    }).catch((error) => {
        console.log(error)
    })
})

//raw query to update data
router.put("/update-raw", (req,res) => {
    sequelize.query("UPDATE tbl_users SET name = '" + req.body.name +  "' ,email = '" + req.body.email + "' WHERE id = " + req.body.id, {
        type: sequelize.QueryTypes.UPDATE
    }).then((response) => {
        res.status(200).json({
            status: 1,
            message: "user updated successfully"
        })
    }).catch((error) => {
        console.log(error);
    })
})
//update api method
router.put("/user", (req,res) => {
    User.update({
        name: req.body.name,
        email: req.body.email,
        rollNo: req.body.rollNo
    }, {
        where: {
            id: req.body.id
        }
    }).then((response) => {
        res.status(200).json({
            status: 1,
            message: "User has been updated successfully!"
        })
    }).catch((error) => {
        res.status(500).json({
            status: 0,
            message: "failed to update user",
            data: error
        })
    })
})

//delete api method
router.delete("/user/:id",(req,res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then((data) => {
        res.status(200).json({
            status: 1,
            message: "user has been deleted successfully." 
        })
    }).catch((error) => {
        res.status(500).json({
            status: 0,
            message: "failed to delete user",
            data: error
        })
    })
})
//default welcome page route
router.get("/", (req,res) => {
    res.status(200).json({
       status: 1,
       message: "welcome to home page"
    })
})

module.exports = router;