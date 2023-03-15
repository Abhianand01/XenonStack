import mongoose, {model, Schema} from "mongoose";

const teacherSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    Number:{
        type: Number,
        required: true
    },
    department:{
        type:String,
        required: true
    },
    subjects:[{
        type: Schema.Types.ObjectId,
        ref: 'subjects',
        // required: true
    }],
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    }

});


teacherSchema.pre('save', async function(next){
    if(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(this.email))
    {
        const find_user= await teacherModel.findOne({email: this.email})
        if(find_user===null)
            next();
        else{
            throw new Error("Teacher already exist");
        }
    }

    else{
        throw new Error("Invaild Email id");
    }
});


teacherSchema.pre('save', async function(next){
    if(/^[0]?[789]\d{9}$/.test(this.Number))
    {
        const find_user = await teacherModel.findOne({Number: this.Number});
        if(find_user===null)
            next();

        else{
            throw new Error("Teacher already exist");
        }
    }

    else{
        throw new Error("Invaid Phone Number");
    }
})

const teacherModel = model('teachers', teacherSchema);

export default teacherModel;