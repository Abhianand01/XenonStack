import {Schema, model} from "mongoose";
import studentModel from "./studentModel.mjs";
import subjectModel from "./subjectsModel.mjs";

const marksSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'subjects'
    },
    marks: {
        type: Number,
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'students'
    },
    teacher: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'teachers'
    }
});


marksSchema.pre('save', async function(next){

    if(this.marks > 25){
        throw new Error("Marks cannot be greater than 25");
    }
    if(this.marks<0)
    {
        throw new Error("Marks cannot be less than 0");
    }
    else{
        next();
    }
});

marksSchema.pre('save', async function(next){
    const std = await studentModel.findOne({_id: this.student})
    const subject = await subjectModel.findOne({_id: this.subject})
    if(std.semester == subject.semester)
    {
        next();
    }
    else{
        throw new Error("Wrong subject selected");
    }
})

marksSchema.pre('save', async function(next){
    const getMarks = await marksModel.findOne({student: this.student, subject: this.subject});

    if(!getMarks)
    {
        next();
    }
    else{
        throw new Error("This subject marks for the student is already submitted");
    }
})

const marksModel = model('marks', marksSchema);

export default marksModel;
