const express = require('express');
const User = require('../models/user');
const sharp = require('sharp')
const routerUser = new express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const { sendEmailCreation, deletEmailmessage } = require('../emails/account')



// routerUser.get('/users/me', auth, async (req, res) => {
//         res.send(req.user)
// })
routerUser.get('/users', async (req, res) => {

    try{
        const newUser = await User.find()
        // console.log(newUser)
        res.send(newUser)    
    }catch(e){
        res.status(400).send(e)
    }
    
   
})
routerUser.post('/users', async (req, res) => {
    
    const user1 = new User(req.body)
    
    try{
        const token = await user1.generateToken();
        sendEmailCreation(user1.email, user1.name)
        await user1.save()
        res.send({ user1, token })
    }catch(e){
        res.status(400).send(e)
    }

})
routerUser.patch('/users/me', auth, async (req, res) => {

    const updateUser = Object.keys(req.body);
    const existUser = ["age", "name", "password"];
    const isValidator = updateUser.every((user) => existUser.includes(user));


    try{
        // const newUser = await User.findById(req.params.id);
        updateUser.forEach((i) => req.user[i] = req.body[i])

        await req.user.save()
        
        //const newUser = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true });
        // console.log(req.user)
        // if (!req.user){
        //     return res.status(400).send({error:"put another Id"})
        // }
        if (isValidator){
            res.send(req.user)
        }else{
            res.send("put another key user")
        }
        

    }catch(e){
        res.status(400).send()
    }

})
routerUser.post('/users/login', async (req, res) => {

    try{
        
        const newuser = await User.findByEmailPassword(req.body.name, req.body.password)
        const token = await newuser.generateToken();

        if (!newuser){  
            res.status(400).send()
        }
        res.send({ newuser , token })
    }catch(e){
        res.status(400).send(e)
    }

})
routerUser.post('/users/logout', auth, async (req, res) => {

    try{
        req.user.tokens = req.user.tokens.filter((user) => {
            return user.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }

})
routerUser.post('/users/logoutAll', auth, async (req, res) => {

    try{
        req.user.tokens = []
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send()

    }
})
routerUser.delete('/users/me', auth, async (req, res) => {

    try{
        await req.user.remove();
        deletEmailmessage(req.user.email, req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
    
})
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, callback){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error ('please upload a word document'))
        }

        callback(undefined, true)
    }
})

routerUser.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error, req, res, next) => {
    res.status(400).send({ error:error.message })
})
routerUser.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
routerUser.get('/users/:id/avatar', async (req, res) => {

    try{
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(404).send()
    }

})

module.exports = routerUser;