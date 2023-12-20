import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  homePage,
  dashboardPage,
  profilePage,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { OAuthCallback, userInfo } from "../controllers/OAuthController.js";
import User from "../models/userModel.js";

const router = express.Router();

// router.post("/", registerUser);
// router.post("/auth", authUser);
// router.post("/logout", logoutUser);

/*router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);*/

router.get("/cmuOAuthCallback", OAuthCallback);
router.get("/signIn", userInfo);

router.get("/getUser", async function (req, res) {
  /*
  const token = req.session.token;
  if (token) {
    res.send(token);
  }

  res.send("not found access token");
  */
});

//! implement in progress
router.get("/home", homePage);
router.get("/admin", dashboardPage);
router.get("/profile", profilePage);

export default router;