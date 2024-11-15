const User = require("../modal/user.modal")
const bcrypt = require("bcrypt")
const createTokenSaveCookie = require("../middleware/generateToken");
const jwt = require("jsonwebtoken");



module.exports.register = async (req, res, next) => {
    // console.log(req.body);
    try {
        const { username, phone, email, password } = req.body;
        const usernameCheck = await User.findOne({ username })
        if (usernameCheck)
            return res.json({ msg: "Username already used", status: false })
        const emailCheck = await User.findOne({ email })
        if (emailCheck)
            return res.json({ msg: "Email already used", status: false })
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            username,
            phone,
            password: hashedPassword
        });
        delete user.password;
        return res.json({ status: true, user })
    } catch (ex) {
        next(ex);
    }
}

// module.exports.register = async (req, res, next) => {
//     // console.log(req.body);
//     try {
//         const { username, phone, email, password } = req.body;
//         const usernameCheck = await User.findOne({ username })
//         if (usernameCheck)
//             return res.json({ msg: "Username already used", status: false })
//         const emailCheck = await User.findOne({ email })
//         if (emailCheck)
//             return res.json({ msg: "Email already used", status: false })
//         const hashedPassword = await bcrypt.hash(password, 10)
//         const user = await User.create({
//             email,
//             username,
//             phone,
//             password: hashedPassword
//         });
//         await user.save();
//         if (user) {
//             createTokenSaveCookie(user._id, res)
//             res.status(201).json({
//                 message: "User register successfully", user
//                 // : {
//                 //     _id: user._id,
//                 //     name: user.username,
//                 //     email: user.email,
//                 //     phone: user.phone,
//                 // }
//             })
//         }
//         return res.json({ status: true, user })
//     } catch (ex) {
//         next(ex);
//     }
// }

module.exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user)
        return res.json({ msg: "Incorrect username or password", status: false });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.json({ msg: "Incorrect username or password", status: false });
  
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "366d" }
      );
  
      const userResponse = user.toObject();
      delete userResponse.password; // Remove the password from the response
  
      return res.json({ status: true, user: { ...userResponse, token } });
    } catch (ex) {
      next(ex);
    }
  };
  

module.exports.getAllUser = async (req, res, next) => {
    try {
        const baseUrl = 'http://localhost:5000';

        const users = await User.find({ _id: { $ne: req.params.id } }).select('username image email');

        if (!users || users.length === 0) {
            return res.json({ msg: "No users found", status: false });
        }

        const userDetails = users.map(user => ({
            _id: user._id,
            name: user.username,
            email: user.email,
            image: user.image ? `${baseUrl}${user.image}` : null
        }));

        return res.json({ status: true, users: userDetails });
    } catch (ex) {
        next(ex);
    }
};

module.exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const baseUrl = 'http://localhost:5000';

        const user = await User.findById(userId).select('username image email phone');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userDetails = {
            name: user.username,
            email: user.email,
            phone: user.phone,
            image: user.image ? `${baseUrl}${user.image}` : null
        };

        res.status(200).json({ message: 'User details fetched successfully', data: userDetails });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};

module.exports.updateDetails = async (req, res) => {
    try {
        const { username } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, image: imageUrl },
            { new: true }
        );

        if (user) {
            res.status(201).json({ message: 'Profile updated successfully', data: user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// export const logout = async (req, res) => {
//     try {
//         res.clearCookie('token')
//         res.status(200).json({ message: "User logout successfully" })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "Internal Server error" })
//     }
// }
