const express = require('express');
const Tasks = require('../models/task');
const taskrouter = new express.Router();
const auth = require('../middleware/auth');

// GET /tasks?completed = true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:deck
taskrouter.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === desc ? -1 : 1;
    }

    try{
        //const task = await Tasks.find({owner: req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        //const task = await Tasks.findOne(req.user)
        res.send(req.user.tasks)

    }catch(e){
        res.status(400).send(e)
    }

})

taskrouter.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id;
    
    try{

        const task = await Tasks.findOne({ _id, owner:req.user._id })
        if (!task){
            return res.status(400).send()
        }
        res.send(task)
    
    }catch(e){
        res.send(404).send(e)
    }


})

taskrouter.post('/tasks', auth, async (req, res) => {
    
    const tasks = new Tasks({
        ...req.body,
        owner:req.user._id
    });

    try{
        await tasks.save();
        res.send(tasks)
    }catch(e){
        res.status(400).send(e)
    }
    
})
taskrouter.patch('/tasks/:id', auth, async (req, res) => {

    const updateTasks = Object.keys(req.body);
    const existTasks = ["completed", "description"];
    
    const isValidator = updateTasks.every((user) => existTasks.includes(user))
    
    try{

        // const task = await Tasks.findById(req.params.id);
        const task = await Tasks.findOne({ _id:req.params.id, owner:req.user._id })
        if (!task){
            return res.status(400).send()
 
         }
        updateTasks.forEach((i) => task[i] = req.body[i])
        
        await task.save();
        //const newTask = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true,  runValidators:true });
        
        
        if (isValidator){
            res.send(task);
        }else{
            res.send("put another key plss")
        }
        
    }catch(e){
        
        res.status(400).send(e)
    }
})
taskrouter.delete('/tasks/:id', auth, async (req, res) => {

    try{
        // const deletTask = await Tasks.findByIdAndDelete(req.params.id);
        const deletTask = await Tasks.findByIdAndDelete({ _id:req.params.id, owner:req.user._id })

        if (!deletTask){
            res.status(404).send()
        }
        res.send(deletTask)
    }catch{
        res.status(404).send()
    }
    
    

})
// taskrouter.delete('/tasks/me', auth, async (req, res) => {

//     try{
//         await req.user.remove();
//         res.send(req.user)
//     }catch(e){
//         res.status(400).send(e)
//     }
    
// })

module.exports = taskrouter;