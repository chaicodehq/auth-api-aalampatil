import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';

/**
 * TODO: Register a new user
 *
 * 1. Extract name, email, password from req.body
 * 2. Check if user with email already exists
 *    - If yes: return 409 with { error: { message: "Email already exists" } }
 * 3. Create new user (password will be hashed by pre-save hook)
 * 4. Return 201 with { user } (password excluded by default)
 */
export async function register(req, res, next) {
  try {
    // Your code here
    const { name, email, password } = req.body || {};
    if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "" || password.length < 6 || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({
      error: { message: "All fields are required" }
    });
    console.log(req.body)
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).send({ error: { message: "Email already exists" } })
    const user = await User.create({ name, email, password })
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Login user
 *
 * 1. Extract email, password from req.body
 * 2. Find user by email (use .select('+password') to include password field)
 * 3. If no user found: return 401 with { error: { message: "Invalid credentials" } }
 * 4. Compare password using bcrypt.compare(password, user.password)
 * 5. If password wrong: return 401 with { error: { message: "Invalid credentials" } }
 * 6. Generate JWT token with payload: { userId: user._id, email: user.email, role: user.role }
 * 7. Return 200 with { token, user } (exclude password from user object)
 */
export async function login(req, res, next) {
  try {
    // Your code here
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password")
    if (!user) return res.status(401).send({ error: { message: "Invalid credentials" } })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).send({ error: { message: "Invalid credentials" } })
    const payload = { userId: (user._id).toString(), email: user.email, role: user.role }
    console.log(payload)
    const token = signToken(payload)
    const userObj = user.toObject()
    delete userObj.password

    return res.status(200).send({ token, user: userObj })
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get current user
 *
 * 1. req.user is already set by auth middleware
 * 2. Return 200 with { user: req.user }
 */
export async function me(req, res, next) {
  try {
    // Your code here
    const user = req.user
    const userObj = user.toObject()
    delete userObj.password
    return res.status(200).send({ user: userObj })
  } catch (error) {
    next(error);
  }
}
