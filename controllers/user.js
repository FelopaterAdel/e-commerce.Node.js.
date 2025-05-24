import { catchAsync } from "../utils/wrapperFunction.js";
import userModel from "../models/user.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

export const Register = catchAsync(async (req, res, next) => {
    const user = req.body;

    const newUser = await userModel.create(user);

    res.status(201).json({
        status: "success",
        data: newUser,
    });

})

export const Login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422)({
            status: "fail",
            message: err.message
        });

    }
    let user = await userModel.findOne({ email })
    if (!user) {
        return res.status(401)({
            status: "invalid email or password",
            message: err.message
        });

    }
    let isvalide = await bcrypt.compare(password, user.password);
    if (!isvalide) {
        return res.status(401)({
            status: "invalid email or password",
            message: err.message
        });
    }
    let token = jwt.sign({ id: user._id, email: user.email, UserType: user.UserType }, process.env.SECRET, { expiresIn: "1h" });
    res.status(200).json({
        status: "success",
        token: token
    })
})

export const Reset_password = catchAsync(async (req, res, next) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({
            status: "fail",
            message: "Email and new password are required"
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            status: "fail",
            message: "User not found"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
        status: "success",
        message: "Password reset successfully"
    });
})

export const Update_user = catchAsync(async (req, res, next) => {
    const  id  = req.id;
    console.log(req.id);
    const updateData = req.body;

    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    let user = await userModel.findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true, runValidators: true });


    if (user) {
        res.status(200).json({
            status: "update success",
            data: user,
        });
    } else {
        res.status(404).json({
            status: "failed",
            message: "User Not found ",
        });
    }

})

export const Delete_user = catchAsync(async (req, res, next) => {
    const  id  = req.id;

    let user = await userModel.findOneAndDelete({ _id: id });

    if (user) {
        res.status(200).json({
            status: "delete success",
            data: user,
        });
    } else {
        res.status(404).json({
            status: "failed",
            message: "user not found",
        });
    }



})

export const forgot_password=catchAsync(async(req,res,next)=>{
const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken =jwt.sign({ id: user._id, email: user.email, UserType: user.UserType }, process.env.SECRET, { expiresIn: "1h" });

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `Click to reset your password: ${resetUrl}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: message,
    });

    res.json({ message: 'Reset email sent' });
  } catch (err) {
        console.error('Error during forgot-password:', err); 
    res.status(500).json({ message: 'Error sending reset email' });
  }
});