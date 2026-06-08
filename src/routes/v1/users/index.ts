import { Router } from "express"
import { UserModel } from "../../../models/user.model"

const usersRouter = Router()

// GET ALL USERS
usersRouter.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 5
    const search = String(req.query.search || "")

    // console.log("SEARCH FROM DB:", search)

    const skip = (page - 1) * limit

    const filter = {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }

    const total = await UserModel.countDocuments(filter)

    const users = await UserModel.find(filter)
      .skip(skip)
      .limit(limit)

    res.json({
      data: users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
    })
  }
})

// GET CURRENT USER
usersRouter.get("/me", async (req: any, res) => {
  try {
    const user = await UserModel.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    res.json({
      user,
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    })
  }
})

// CREATE USER
usersRouter.post("/", async (req, res) => {
  try {
    console.log("CREATE USER BODY:", req.body) 

    const newUser = await UserModel.create(req.body)

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Failed to create user",
    })
  }
})

// UPDATE USER
usersRouter.put("/:id", async (req, res) => {
  try {

    console.log("UPDATE ID:", req.params.id)
    console.log("UPDATE BODY:", req.body)

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    console.log("UPDATED USER:", updatedUser)

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to update user",
    })
  }
})

// DELETE USER
usersRouter.delete("/:id", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id)

    res.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
    })
  }
})

export default usersRouter