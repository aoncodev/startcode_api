import { AppDataSource } from "../../data-source";
import * as express from "express";
import { CourseBlog } from "../../entity/Course";
import { User } from "../../entity/User";
import { authenticateToken } from "../../middleware/auth";
const router = express.Router();

router.get("/courses", authenticateToken, async (req, res) => {
  try {
    const courseRepository = AppDataSource.getRepository(CourseBlog);
    await courseRepository
      .find()
      .then((result) => res.status(200).json(result));
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/course", authenticateToken, async (req, res) => {
  try {
    const courseRepository = AppDataSource.getRepository(CourseBlog);
    const userRepository = AppDataSource.getRepository(User);
    const { title, body } = req.body;
    const user = req.user;

    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized request!" });
    }

    const newCourse = courseRepository.create({
      title,
      body,
      createdBy: user.userID
    });
    await courseRepository.save(newCourse);
    return res.status(201).json({ message: "New course created!" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
