import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../libs/db";
import User from "../libs/models/User";


export default async function handler(req, res) {
  
   // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // or restrict to your frontend
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Actual API logic
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Example: simple register logic
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // ... register user here

    res.status(200).json({ message: "User registered successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }




  await connectDB();
  const { action } = req.query;

  if (action === "register") {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    return res.json({ success: true });
  }

  if (action === "login") {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(user.toObject(), process.env.JWT_SECRET);
    return res.json({ token });
  }

  if (action === "admin") {
    const { pin } = req.body;
    if (pin !== process.env.ADMIN_PIN)
      return res.status(401).json({ error: "Invalid PIN" });

    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET);
    return res.json({ token });
  }

  res.status(400).json({ error: "Invalid action" });
}
