const User = require('../models/userModel');
const Family = require("../models/familyModel")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt")
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.configDotenv()

exports.signUp = async (familyData) => {
  if (!familyData.email) {
    return {
      completed: false,
      message: 'Email cannot be left blank'
    }
  }
  if (!familyData.password) {
    return {
      completed: false,
      message: 'Password cannot be left blank'
    }
  }

  if (!familyData.email && !familyData.password) {
    return {
      completed: false,
      message: 'Email and password cannot be left blank'
    }
  }
  const existingEmail = await Family.findOne({
    email: familyData.email
  });
  if (existingEmail) {
    if (existingEmail.status == true) {
      return {
        completed: false,
        message: 'Email is already registered'
      }
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000);
    const expiresVerifyCode = Date.now();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(familyData.password, saltRounds);

    await sendVerifyCode(familyData.email, verifyCode);

    const filterEmail = familyData.email;

    const update = {
      password: hashedPassword,
      verifyCode: verifyCode,
      verifyCodeExpires: expiresVerifyCode,
      status: false
    };
    const options = { new: true, upsert: true };

    await Family.findOneAndUpdate({ email: filterEmail }, update, options);

    const getNewFamily = await Family.findOne({
      email: filterEmail
    });

    if (getNewFamily) {
      return {
        completed: true,
        message: 'We have successfully sent the verification code to your email',
        familyId: getNewFamily.id
      };
    }

  }
  if (familyData.password != familyData.confirmPassword) {
    return {
      completed: false,
      message: "Passwords are not the same"
    }
  }
  const verifyCode = Math.floor(100000 + Math.random() * 900000);
  const expiresVerifyCode = Date.now();
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(familyData.password, saltRounds);

  await sendVerifyCode(familyData.email, verifyCode);

  const newFamily = new Family({
    email: familyData.email,
    password: hashedPassword,
    verifyCode: verifyCode,
    verifyCodeExpires: expiresVerifyCode,
    status: false
  });

  await newFamily.save();

  const getNewFamily = await Family.findOne({
    email: newFamily.email
  });

  if (getNewFamily) {
    return {
      completed: true,
      message: 'We have successfully sent the verification code to your email',
      familyId: getNewFamily.id
    };
  }
};

exports.VerifyCodeEmail = async (familyData) => {
  const family = await Family.findOne({
    _id: familyData.familyId
  });

  if (family.verifyCode != familyData.code) {
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
  if (family.verifyCode == familyData.code && diffSeconds < 600) {
    await family.updateOne({ status: true });
    return {
      completed: true,
      message: "Code validation successful, please Login",
    }
  }
}

exports.createNewUser = async (data) => {
  if (!data.username) {
    return {
      completed: false,
      message: "UserName cannot be left blank"
    }
  }
  if (!data.role) {
    return {
      completed: false,
      message: "Please choose your role"
    }
  }

  if (!data.password) {
    return {
      completed: false,
      message: "Password cannot be left blank"
    }
  }

  const family = await Family.findOne({
    _id: data.familyId
  });

  if (!family) {
    return {
      completed: false,
      message: "Family not found for the provided email"
    };
  }


  const user = await User.find({
    familyId: data.familyId,
    role: data.role
  });

  if (user.length > 0) {
    return {
      completed: false,
      message: "This member has been created"
    };
  }


  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const newUser = new User({
    username: data.username,
    password: hashedPassword,
    role: data.role,
    familyId: family._id,
    avatar: data.avatar,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
  });

  try {
    const savedUser = await newUser.save();

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

exports.SignInFamily = async (familyData) => {
  if (!familyData.email) {
    return {
      completed: false,
      message: "Email cannot be left blank"
    }
  }
  if (!familyData.password) {
    return {
      completed: false,
      message: "Password cannot be left blank"
    }
  }

  const family = await Family.findOne({
    email: familyData.email
  });
  console.log(family);
  if (!family) {
    return {
      completed: false,
      message: "Your email is not registered"
    }
  }

  const passwordMatch = await bcrypt.compare(familyData.password, family.password);

  if (!passwordMatch) {
    return {
      completed: false,
      message: "Your Password is wrong, please re-enter"
    };
  }


  if (family) {
    if (family.status == false) {
      return {
        completed: false,
        message: "Your email is not registered"
      }
    }

    return {
      completed: true,
      message: "Sign in successfully",
      familyId: family._id
    }
  }
}

exports.SignInRoleUser = async (Data) => {
  const familyId = Data.familyId
  const user_role = Data.role
  const user_password = Data.password

  if (!familyId) {
    return {
      completed: false,
      message: 'Missing familyId'
    }
  }
  if (!user_role) {
    return {
      completed: false,
      message: "Please select your role!"
    }
  }
  if (!user_password) {
    return {
      completed: false,
      message: "Please type your password role!"
    }
  }
  try {
    console.log(user_role);
    console.log(familyId);

    const users = await User.find({ familyId: familyId, role: { $regex: new RegExp(user_role, 'i') } });
    console.log(users);

    if (!users || users.length == 0) {
      return {
        completed: false,
        message: "Not registered for this role, please register before Sign in"
      };
    }
    let foundUser = null;
    for (const user of users) {
      const passwordMatch = await bcrypt.compare(user_password, user.password);
      if (passwordMatch) {
        foundUser = user;
        break;
      }
    }

    if (foundUser) {
      const userId = foundUser._id;
      const deviceToken = Data.deviceToken;
      const result = await saveDeviceTokenToUser(userId, deviceToken);
      return {
        completed: true,
        userId: foundUser._id,
        familyId: familyId,
        message: "Login successful",
        deviceToken: deviceToken
      };
    }
    if (!foundUser) {
      return {
        completed: false,
        message: "Your Password role is wrong, please re-enter"
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      completed: false,
      message: "An error occurred while processing your request"
    };
  }
}



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendVerifyCode = async (recipientEmail, code) => {
  try {
    // Tạo nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
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
    console.log("info: ", info);
    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function saveDeviceTokenToUser(userId, deviceToken) {
  try {
    const user = await User.findByIdAndUpdate(userId, { deviceToken }, { new: true });

    if (user) {
      return {
        completed: true,
        message: "Device token has been successfully saved to user record.",
      };
    } else {
      return {
        completed: false,
        message: "User not found."
      };
    }
  } catch (error) {
    console.error('Error saving device token to user record:', error);
    return {
      completed: false,
      message: "Failed to save device token to user record."
    };
  }
}


