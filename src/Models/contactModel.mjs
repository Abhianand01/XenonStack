import {mongoose, Schema, model} from 'mongoose';

const contactSchema = new Schema({
    name:{
        type: String,
        requird: true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    message:{
        type: String,
        required: true
    }

});
contactSchema.pre('save', async function(next){
    if(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(this.email))
    {
        next();
    }

    else{
        throw new Error("Invaild Email id");
    }
});


contactSchema.pre('save', async function(next){
    if(/^[0]?[789]\d{9}$/.test(this.Number))
    {
        next();
    }

    else{
        throw new Error("Invaid Phone Number");
    }
})

const contactModel = model("contacts",contactSchema);
export default contactModel

