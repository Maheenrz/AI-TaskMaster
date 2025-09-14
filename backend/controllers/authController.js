import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* Register */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password are required" })


        //check existing
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: "Email already registered" })

        // hash
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashed })
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })


        res.status(201).json({
            user: { id: user._id, email: user.email, name: user.name },
            token
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}



// Login
export const loginUser = async (req, res) => {
    try{
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({message: "Email and password are required!"})

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({message: "Invalid credentials"})    

    const isMatch = await bcrypt.compare(password, user.password)    
    if (!isMatch) return res.status(401).json({message: "Invalid credentials"})

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
    res.status(201).json({
        user:{id: user._id, email:user.email, name:user.name},
        token
    }) 
     } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }   
}


/* Get current user (protected) */
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};