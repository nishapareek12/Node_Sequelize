const express = require("express")
const userModel = require("./models").User
const roleModel = require("./models").Role
const userRoleModel = require("./models").UserRole
const app = express();
const PORT = 8087
//get all users and ther respective roles
app.get("/users", (req,res) => {
    userModel.findAll({
        include: {
            model: roleModel,
            through: {
                model: userRoleModel
            }
        }
    }).then((data) => {
        res.status(200).json({
            status: 1,
            data: data
        })
    })
})
app.get("/", (req,res) => {
    res.status(200).json({
        status: 1,
        message: "welcome to my home page"
    })
})

app.listen(PORT, () => {
    console.log("Application is running at" +PORT)
})