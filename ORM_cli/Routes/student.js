const express = require("express")
const studentModel = require("../models").Student
const router = express.Router();
const bcrypt  = require("bcrypt")
const Sequelize = require("sequelize")
const jwtConfig = require("../config/jwt-config")
const Op = Sequelize.Op;
const JWT = require("jsonwebtoken")
const jwtMiddleware = require("../config/jwt-middleware")
router.post("/student", (req,res) => {
    studentModel.findOne({
        where: {
            email: {
                [Op.eq]:req.body.email
            }
        }
    }).then((user) => {
        if(user){
          //user already exists
          res.status(500).json({
            status: 0,
            message: "user already exists"
          })
        }else{
          //create new user
          studentModel.create({
            name: req.body.name,
            email: req.body.email,
            rollNo: req.body.rollNo,
            password: bcrypt.hashSync(req.body.password,10)
          }).then((user) => {
            res.status(200).json({
                status: 1,
                message: "user created successfully"
            })
          }).catch((data) => {
            res.status(500).json({
                data:data
            })
          })
        }
    })
})

router.get("/students", (req,res) => {
    studentModel.findAll().then((data) => {
        if(data){
            res.status(200).json({
                status: 1,
                message: "student data found",
                data: data
            })
        }else{
            res.status(500).json({
                status: 1,
                message: "Data not found"
            })
        }
    }).catch((err) => {
        console.log(err)
    })
})

router.post("/login", (req,res) => {
    studentModel.findOne({
        where:{
            email:{
                [Op.eq] : req.body.email
            }
        }
    }).then((student) => {
        if(student){
            let password = req.body.password
            if(bcrypt.compareSync(password, student.password)){
                let token = JWT.sign({
                    id:student.id,
                },jwtConfig.secret,{
                    expiresIn: jwtConfig.expiresIn,
                    notBefore: jwtConfig.notBefore
                })
                res.status(200).json({
                    status: 0,
                    message:"login successfull!",
                    token: token
                })
            }else{
                res.status(500).json({
                    status: 0,
                    message:"password doesn't matched!"
                })
            }
        }else{
            res.status(500).json({
                status: 0,
                message: "student doesn't exists"
            })
        }
    })
})

router.post("/profile",jwtMiddleware.checkToken, (req,res) => {
    let student_id = req.data.id;
    studentModel.findByPk(student_id).then((student) => {
        if(student){
            res.status(200).json({
                status: 1,
                message: "profile data",
                data: student
            })
        }
    })
})
module.exports = router;