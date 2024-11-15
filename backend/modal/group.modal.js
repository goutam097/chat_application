const mongoose = require('mongoose');



const GroupSchema = mongoose.Schema(
    {
        members: [{
            memberId: {
              type: mongoose.SchemaTypes.ObjectId,
              ref: 'User',
              required: true,
            },
            isAdmin: {
              type: Boolean,
              default: false,
            },
          }],
        description: {
            type: String,
            default: '',
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: false,
            default: '',
        },
       createdBy:{
        type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
       }

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Group", GroupSchema)



// user_id:[{
//     memberId:6731de0434ab1b95ca1e0eb5,
//     isAdmin: false
// },{
//     memberId:6731de0434ab1b95cb1e0eb5,
//     isAdmin: false
// },{
//     memberId:6731de0434ab1b95ce1e0eb5,
//     isAdmin: false
// },{
//     memberId:6731de0434ab1b95cd1e0eb5,
//     isAdmin: true
// }
// ]