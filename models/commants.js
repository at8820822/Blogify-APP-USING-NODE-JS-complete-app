const { Schema, model } = require("mongoose");

const commantSchema = new Schema({

    content :{
     type: String,
     required: true,
    },

    blogId:{
        type : Schema.Types.ObjectId,
        ref : "blog",
    },

    createdBy:{

        type : Schema.Types.ObjectId,
        ref : "User",
    
    },
},
{
    timestamps: true,
  })

  const Commant = model('commant',commantSchema );
  
  module.exports = Commant; 