const express =  require("express")
const Sequelize =  require("sequelize")
const bodyParser = require("body-parser") 
const appRoutes = require("./routes")
//bodyparser is used to get request query parameters from url

const app = express()
app.use(bodyParser.json())
const PORT = 8087

app.use("/", appRoutes)

//listen request here
app.listen(PORT, () => {
    console.log("App is listening to PORT")
})

