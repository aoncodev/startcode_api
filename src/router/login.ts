import * as express from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { userID, password } = req.body;
    const user = await userRepository.findOne({ where: { userID: userID } });
    if (!user) {
      return res.status(400).json({ message: "Wrong ID" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = generateToken({ userID: user.userID, role: user.role });
    // Password is correct, proceed with login
    // Here you might generate a JWT token and send it back to the client
    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
