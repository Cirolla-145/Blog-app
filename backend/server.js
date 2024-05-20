const exp =require('express')
const app=exp()

//process.env used to interact with .env file
require('dotenv').config()//install using npm install npm config
const mongoCliet=require('mongodb').MongoClient
const path=require('path')

//deply react build in this server
app.use(exp.static(path.join(__dirname,'../client/build')))
//to parse body of req
app.use(exp.json())



//connect to db
mongoCliet.connect(process.env.DB_URL)
.then(client=>{
    //get db obj
    const blogdb=client.db('blogdb')
    //get collection obj
    const userscollection=blogdb.collection('userscollection')
    const articlescollection=blogdb.collection('articlescollection')
    const authorscollection=blogdb.collection('authorscollection')
    //share collection obj with express api
    app.set('userscollection',userscollection)
    app.set('articlescollection',articlescollection)
    app.set('authorscollection',authorscollection)
    //confirm db connection status
    console.log("DB connection success")
})
.catch(err=>console.log("Err in DB connection",err))




//import API routes
const userApp=require('./APIs/user-api')
const authorApp=require('./APIs/author-api')
const adminApp=require('./APIs/admin-api')




//if path starts with user-api, send req to userApp
app.use('/user-api',userApp)
//if path starts with author-api, send req to authorApp
app.use('/author-api',authorApp)
//if path starts with admin-api, send req to adminApp
app.use('/admin-api',adminApp)

//deals with page refresh
//it should be written only on the top of the middleware
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'))
})




//express error handler
app.use((err,req,res,next)=>{
    res.send({message:'error',payload:err.message})

    console.log(err)
})
//assign port number
const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`Web server on port ${port}`))