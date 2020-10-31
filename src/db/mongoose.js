const mongoose = require('mongoose');
// const validator = require('validator');

mongoose.connect(process.env.MANGODB_URL , {
    // _id:mongoose.Schema.Types.ObjectId,
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

// const User = mongoose.model('User', {

//     name:{
//         type:String,
//         trim:true
//     },
//     age:{
//         type:Number
//     },
//     password:{
//         type:String,
//         required:true,
//         trim:true,
//         validate(value){
//             if (value.length < 6){
//                 throw new Error("You must type password greater than 6")
//             }
//             if (value.includes("password")){
//                 throw new Error("Don't type password")
//             }
//         }
//     }
// })

// const db = new User({
//     name:"Soumiya",
//     age:24,
//     password:"pass"
// })
//db._id = mongoose.Types.ObjectId('000000000000000000000001');
// description:"The project in the Middle",
    //         completed:true
// const Tasks = mongoose.model('Tasks', {
//     description:{
//         type:String,
//         required:true,
//         trim:true,
//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
// })

// const db = new Tasks ({
//     description:"the project test2",
    
// })


// db.save().then(() => {
//     console.log(db)
// }).catch((error) => {
//     console.log(error)
// })