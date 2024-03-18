const express = require("express")
const bodyParser = require("body-parser")
//incoude routes
const productRoutes = require("./Routes/product")
const studentRoutes = require("./Routes/student")
const PORT  = 8081
const app = express()
app.use(bodyParser.json())
app.use("/", productRoutes)
app.use("/", studentRoutes)
app.get(("/"), (req,res) => {
    res.send("welcome to my home page")
})
app.listen(PORT, () => {
    console.log("app is listening to port 8081")
})