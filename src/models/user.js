const mongoose = require("mongoose");
const validator=require("validator");
const jwt=require("mongoose");
const bcrypt=require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
          validator: function (value) {
            return validator.isEmail(value);   // ✅ must return true/false
          },
          message: (props) => `Invalid email address: ${props.value}`,
        },
      },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    photoUrl: {
      type: String,
      default: "https://stock.adobe.com/search?k=dummy",
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
    }
  },
  {
    timestamps: true,
  }
);

userSchema.method.getJWT= async function(){
    const user=this;
    const token= await jwt.sign({_id:user._id},"DEV@Tinder$790",{
        expiresIn:"7d",
    });
    return token;
};

userSchema.method.validatePassword=async function (passwordInputByUser){
    const user=this;
    const passwordHash=user.password;

    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}


const User = mongoose.model("User", userSchema);
module.exports = User;
