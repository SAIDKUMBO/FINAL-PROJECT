const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.send("Welcome to our home page")
})

app.listen(3000)