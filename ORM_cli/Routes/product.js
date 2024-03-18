const express = require("express");
const { Sequelize } = require("sequelize");
const productModel = require("../models").Product;
const router = express.Router();
const Op = Sequelize.Op;

router.get("/products", (req,res) => {
   productModel.findAll({
    // attributes:["id","name"],
    // limit: 10,
    // offset: 4,
    // order: [["name","ASC"]]
    where: {
        // id:{
        //     [Op.or]:{
        //       [Op.gte]:322,
        //       [Op.lt]:355
        //     }
        // }
        [Op.or]: {
            id: {
                [Op.eq]: 322
            },
            name: {
                [Op.eq]: "Fantastic Steel Chips"
            }
        }
    }
   }).then((data) => {
    if(data){
        //we have some data
        res.status(200).json({
            status: 1,
            message: "products page",
            data: data
         })
    }else{
        //no data found
        res.status(200).json({
            status: 0,
            message: "data not found"
         })
    }
   }).catch((err) => {
    console.log(err)
   })
})

module.exports = router;