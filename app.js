const express = require('express')
const app = express()

app.get('/', (req,res)=>{
 res.send("Hello from Jenkins-ArgoCD Demo")
})

app.listen(3000)
