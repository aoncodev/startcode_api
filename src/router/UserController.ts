import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import * as express from "express";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import validator from "validator";
const router = express.Router();

router.get("/users", async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.find().then((result) => {
    res.status(200).json(result);
  });
});

router.post("/user", async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const { userID, email, password, role } = req.body;

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
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

router.get("/user/:id", async (req, res) => {
  const userRepository = AppDataSource.getRepository(User);
  const id = parseInt(req.params.id);

  const user = await userRepository.findOne({
    where: { id }
  });

  if (!user) {
    return res.status(400).json({ message: "unregistered user" });
  }
  return res.status(200).json(user);
});

router.delete("/user/:id", async (req, res) => {
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
});

export default router;
/*
export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { userID, email, password, role } = request.body;
    
        // Validate email format
        if (!validator.isEmail(email)) {
            return 'Invalid email address';
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Check if the user already exists
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            return {'error':'User already registered'};
        }
    
        // Hash the password
        
    
        // Create a new user instance
        const newUser = this.userRepository.create({
            userID,
            email,
            password: hashedPassword,
            role
        });
    
        // Save the user to the database
        await this.userRepository.save(newUser);
    
        return newUser; // Or return a success message
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }
} 
*/
