var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var fs = require('fs')
var path = require('path')
var url = require('url')

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/usersDB', { useNewUrlParser: true }, { useUnifiedTopology: true })

var UserSchema = new mongoose.Schema({
    'firstName': { type: String, required: true },
    'lastName': { type: String, required: true },
    'mobile': { type: Number, required: true }, 
    'email': String,
    'signupbonus':String
})

var UserModel = mongoose.model('userData', UserSchema)
var  UserModel1 = mongoose.model('inviteUsers', UserSchema)



app.get('/', (req,res)=>{

    fs.readFile('user.html',(err, data)=>{

        res.writeHead(200, {'Content-Type' : 'text/html' })
        res.write(data)
        res.end()
    })
})

app.post('/signup', (req, res) => {
    var q = url.parse(req.url,true)
    
    if(q.pathname.indexOf('referrer') !=0){

    var user2 = new UserModel1(req.body)
    let p = user2.save()
    p.then(() => {
        res.send("successfull saved to database(user2)")
    })
    p.catch(() => {
        res.send("could not save!!! ")
    })
}
else{
    console.log(req.body)
    var user1 = new UserModel(req.body)
    let p = user1.save()
    p.then(() => {
        res.send("successfull saved to database(user1)")
    })
    p.catch(() => {
        res.send("could not save!!! ")
    })
}

})

app.put('/userData/:id', async(req, res) => {
    var user = await UserModel1.findById(req.params.id).exec()
    user.set(req.body)
    var result = await user.save()
    console.log("res-->", result)
    res.send(result + "you have got 100$ as signup bonus.")
})

app.get('/all', async(req, res) => {
    var users = await UserModel.find().exec()
    res.send("All users : "+users)
   
})

app.get('/bonus',async(req,res)=>{

    var users1 = await UserModel1.find().exec()
    res.send("Bonus achievers : "+users1)
})

app.delete('/user/:id', async(req, res) => {
    var result = await UserModel.findByIdAndDelete(req.params.id).exec()
    res.send(result)
})



app.listen(3000, ()=>{

    console.log("Server started")
})