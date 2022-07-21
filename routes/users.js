const {
  getUsers,
  getUser,
  createUser,
  updateUserAvatar,
  updateUserProfile,
} = require("../controllers/users");
const router = require("express").Router();
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUser);
router.patch("/me", updateUserProfile);
router.patch("/me/avatar", updateUserAvatar);
module.exports = router;
