const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true, unique:true, lowercase:true},
    password:{type:String, required:true ,minlenght:6}
},
{timestamps:true}
)


exports = mongoose.model('User',userSchema)

