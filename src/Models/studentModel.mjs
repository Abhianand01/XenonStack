import {mongoose, Schema, model} from 'mongoose';

const studentSchema = new Schema({
    name:{
        type: String,
        requird: true
    },
    email:{
        type: String,
        requird: true
    },
    password:{
        type: String,
        required: true
    },
    roll:{
        type: Number,
        requird: true
    },
    department:{
        type: String,
        required: true
    },
    year:{
        type: Number,
        requird: true
    },
    semester:{
        type: Number,
        required: true
    },
    Number:{
        type: Number,
        required: true
    },
    marks:{
        type: Schema.Types.ObjectId,
        ref: 'marks'
    },
    role:{
        type: String,
        required: true
    }
});

studentSchema.pre('save', async function(next){
    if(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(this.email))
    {
        const find_user= await studentModel.findOne({email: this.email})
        if(find_user===null)
            next();
        else{
            throw new Error("User already exist");
        }
    }

    else{
        throw new Error("Invaild Email id");
    }
});


studentSchema.pre('save', async function(next){
    if(/^[0]?[789]\d{9}$/.test(this.Number))
    {
        const find_user=await studentModel.findOne({Number: this.Number});
        if(find_user===null)
        next();

        else{
            throw new Error("Student already exist");
        }
    }

    else{
        throw new Error("Invaid Phone Number");
    }
})


const studentModel = model('student', studentSchema);

export default studentModel;