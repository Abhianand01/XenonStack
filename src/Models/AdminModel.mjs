import { Schema, model} from "mongoose";

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'admin'
    }
});

const AdminModel = model('admin', AdminSchema);

export default AdminModel;