// const Group = require("../modal/group.modal");

// module.exports.createGroup = async (req, res) => {
//     try {
//         const { user_id, description } = req.body;
//         const imagePath = req.file ? `/uploads/groups/${req.file.filename}` : null;  // Use just filename

//         // Construct group data with image path
//         const groupData = {
//             user_id: JSON.parse(user_id),
//             description,
//             image: imagePath,
//         };

//         const group = await Group.create(groupData);
//         return res.status(201).json({ status: true, group, message: 'Group created successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: false, message: 'An error occurred while creating the group' });
//     }
// };



const Group = require("../modal/group.modal");
const mongoose = require('mongoose');

module.exports.createGroup = async (req, res) => {
  try {
    if (!req.user.userId) {
      return res.status(401).json({ status: false, message: 'User not authenticated' });
    }

    const userIds = JSON.parse(req.body.members);
    
    const formattedMembers = userIds.map(user => ({
      memberId: new mongoose.Types.ObjectId(user.memberId),
      isAdmin: user.isAdmin || false,
    }));

    formattedMembers.push({
      memberId: req.user.userId,
      isAdmin: true,
    })
    const groupData = {
      members: formattedMembers,
      description: req.body.description,
      image: req.file ? req.file.path : '',
      createdBy: req.user.userId,
    };

    const group = await Group.create(groupData);
    res.status(201).json({ status: true, message: 'Group created successfully', group });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: 'Error creating group', error: error.message });
  }
};

  
  

