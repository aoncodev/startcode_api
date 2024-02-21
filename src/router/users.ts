import { AppDataSource } from "../data-source";
import * as express from "express";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import validator from "validator";
import { authenticateToken } from "../middleware/auth";
const router = express.Router();

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.find().then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/user", async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { userID, email, password, role } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already registered" });
    }

    // Create a new user instance
    const newUser = userRepository.create({
      userID,
      email,
      password: hashedPassword,
      role
    });

    // Save the user to the database
    await userRepository.save(newUser);

    return res.status(201).json({ data: newUser }); // Or return a success message
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/:id", authenticateToken, async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const id = parseInt(req.params.id);

    const user = await userRepository.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(400).json({ message: "unregistered user" });
    }
    return res.status(200).json(user);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/user/:id", authenticateToken, async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const id = parseInt(req.params.id);

    let userToRemove = await userRepository.findOneBy({ id });

    if (!userToRemove) {
      return res.status(400).json({ message: "this user not exist" });
    }

    await userRepository
      .remove(userToRemove)
      .then(() =>
        res.status(201).json({ message: `User with id:${id} deleted!` })
      )
      .catch((err) => res.status(400).json({ message: err }));
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
