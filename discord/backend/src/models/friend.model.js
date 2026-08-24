import mongoose from "mongoose";

const friendsSchema = new mongoose.Schema({

});

const friendsModel = mongoose.model("friends" ,  friendsSchema);
export default friendsModel;