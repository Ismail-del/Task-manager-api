const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const task = require('./task');
const userShema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:true
    },
    age:{
        type:Number,
        default:0
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if (value.length < 6){
                throw new Error("You must type password greater than 6")
            }
            if (value.includes("password")){
                throw new Error("Don't type password")
            }
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validateEmail(value){
            if(!validator.isEmail(value)){
                throw new Error("please write a correct email ")
            }
        }
    },
    avatar:{
        type:Buffer
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

userShema.virtual('tasks', {
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'

})

userShema.methods.toJSON = function(){

    const user = this
    const userObject = user.toObject()

    
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    
    return userObject

}

userShema.methods.generateToken = async function(){

    
    const user = this
    const tokenn = jwt.sign({ _id:user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token:tokenn })
    await user.save()

    return tokenn;

}

userShema.statics.findByEmailPassword = async (name, password) => {

    const findName = await User.findOne({ name });
    
    if (!findName){
        throw new Error("We cannot find your name")
    }

    const isMatch = await bcrypt.compare(password, findName.password)

    if (!isMatch) {
        throw new Error("the password does not match")
    }
    return findName
}

userShema.pre('save', async function (next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
userShema.pre('remove', async function (next){

    const user = this
    await task.deleteMany({ owner:user._id })
    next()
})

const User = mongoose.model('User', userShema)

module.exports = User;