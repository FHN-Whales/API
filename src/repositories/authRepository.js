const User = require('../models/userModel');
const Family = require("../models/familyModel")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const moment = require('moment');

exports.signUp = async (userData) => {
  if (!userData.email) {
    return {
      completed: false,
      message: 'Email cannot be left blank'
    }
  }
  if (!userData.password) {
    return {
      completed: false,
      message: 'Password cannot be left blank'
    }
  }

  if (!userData.email && !userData.password) {
    return {
      completed: false,
      message: 'Email and password cannot be left blank'
    }
  }
  const existingEmail = await Family.findOne({
    email: userData.email
  });
  if (existingEmail) {
    if (existingEmail.status == true) {
      return {
        completed: false,
        message: 'Email is already registered'
      }
    }
    const verifyCode = Math.floor(Math.random() * 1000000);
    const expiresVerifyCode = Date.now();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    existingEmail.password = hashedPassword;
    existingEmail.verifyCode = verifyCode;
    existingEmail.verifyCodeExpires = expiresVerifyCode;
    existingEmail.status = false;

    await existingEmail.save();
    await sendVerifyCode(userData.email, verifyCode);
    return {
      completed: true,
      message: 'We have successfully sent the new verification code to your email',
      userId: existingEmail.id,
    };

  }
  if (userData.password != userData.comfirmPassword) {
    return {
      completed: false,
      message: "Passwords are not the same"
    }
  }
  const verifyCode = Math.floor(100000 + Math.random() * 900000);
  const expiresVerifyCode = Date.now();
  await sendVerifyCode(userData.email, verifyCode);

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const newUser = new Family({
    email: userData.email,
    password: hashedPassword,
    verifyCode: verifyCode,
    verifyCodeExpires: expiresVerifyCode,
    status: false
  });
  await newUser.save();
  const getNewUser = await Family.findOne({
    email: newUser.email
  });
  if (newUser) {
    return {
      completed: true,
      message: 'We have successfully sent the verification code to your email',
      userID: getNewUser.id
    };
  }
};

exports.VerifyCodeEmail = async (userData) => {
  const family = await Family.findOne({
    _id: userData.userId
  });
  console.log(userData.userId);
  if (family.verifyCode != userData.code) {
    return {
      completed: false,
      message: "Verification code is wrong, please re-enter"
    }
  }
  const currentTime = moment();
  const verifyCodeExpires = moment(family.verifyCodeExpires);
  const diffSeconds = currentTime.diff(verifyCodeExpires, 'seconds');

  if (diffSeconds > 600) {
    return {
      completed: false,
      message: "Verification code has expired, please click <Reset code>"
    };
  }
  if (family.verifyCode == userData.code && diffSeconds < 600) {
    await family.updateOne({ status: true });
    return {
      completed: true,
      message: "Code validation successful, please Login",
    }
  }
}

exports.getUserDataRegister = async (userData) => {
  if (!userData.username) {
    return {
      completed: false,
      message: "UserName cannot be left blank"
    }
  }
  if (!userData.role) {
    return {
      completed: false,
      message: "Please choose your role"
    }
  }
  const family = await Family.findOne({
    email: userData.email
  });
  if (!family) {
    return {
      completed: false,
      message: "Family not found for the provided email"
    };
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const newUser = new User({
    username: userData.username,
    password: hashedPassword,
    role: userData.role,
    Family_id: family._id,
    avatar: userData.avatar,
    dateOfBirth: userData.dateOfBirth,
    gender: userData.gender,
  });

  try {
    const savedUser = await newUser.save();
    console.log(savedUser);
    return {
      completed: true,
      message: "User has been successfully registered"
    };
  } catch (error) {
    return {
      completed: false,
      message: "Failed to register user: " + error.message
    };
  }
}

exports.SignInFamily = async (userData) => {
  if (!userData.email) {
    return {
      completed: false,
      message: "Email cannot be left blank"
    }
  }
  if (!userData.password) {
    return {
      completed: false,
      message: "Password cannot be left blank"
    }
  }
  const user = await Family.findOne({
    email: userData.email
  });
  if (!user) {
    return {
      completed: false,
      message: "Your email is not registered"
    }
  }
  const passwordMatch = await bcrypt.compare(userData.password, user.password);
  if (!passwordMatch) {
    return {
      completed: false,
      message: "Your Password is wrong, please re-enter"
    };
  }
  if (user) {
    if (user.status == false) {
      return {
        completed: false,
        message: "Your email is not registered"
      }
    }
    return {
      completed: true,
      message: "Sign in successfully"
    }
  }
}


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'it.trungdang@gmail.com',
    pass: 'xogw hqqu xhln jxvu'
  }
});

const sendVerifyCode = async (recipientEmail, code) => {
  try {
    // Tạo nội dung email
    const mailOptions = {
      from: 'it.trungdang@gmail.com',
      to: recipientEmail,
      subject: 'Register account - Verification Code',
      html: `<div style="font-size: 16px;">
      <img src="https://images.pexels.com/photos/60597/dahlia-red-blossom-bloom-60597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Verification Code Image">
      <p>Here's your verification code:</p>
      <p style="font-size: 24px; font-weight: bold;">${code}</p>
      <p>This verification code is valid 10 minutes.</p>
      <p>You are verifying your email address.</p>
      <p>Didn't request this? Please ignore</p>
      <p>Happy using</p>
      <p>FHN</p>
    </div>`,
    };

    // Send email without using req and res parameters
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// const sendCreatePasswordEmail = async (userEmail, userName, token) => {
//   try {
//     // Tạo nội dung email
//     const mailOptions = {
//       from: 'it.trungdang@gmail.com',
//       to: userEmail,
//       subject: 'Create your password',
//       text: `Bạn đang đăng ký tài khoản với username: .\n
//                 Vui lòng nhấp vào liên kết sau để tạo mật khẩu:\n
//                 http://localhost:3000/CreatePw/email=${userEmail}/username=${userName}/tokenCreatePW=${token}\n
//                 Liên kết này sẽ hết hạn sau 1 giờ.`,
//     };

//     // Send email without using req and res parameters
//     const info = await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };


