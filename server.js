const express = require("express");
const cors = require("cors")
const {connectDB} = require("./src/config/database")
const routes = require("./src/routes/index")
require("dotenv").config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/chat/v1",routes);

const port = process.env.PORT


app.listen(port,async function(){
    await connectDB();
    console.log(`server is running on port:${port}`)
})