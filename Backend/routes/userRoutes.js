import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { signInUser, OAuthCallback } from "../controllers/OAuthController.js";
import { getOAuthAccessToken, getCMUBasicInfo } from "../OAuthFunct.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/signIn", signInUser);
// router.get('/signIn', function (req, res) {
//     res.send('Welcome jjj');
// })
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get("/cmuOAuthCallback", OAuthCallback);
router.get("/signIn", async function (req, res) {
  const code = req.query.valid;
  const access_token = await getOAuthAccessToken(code);

  // Set the token in the session
  req.session.token = access_token;

  const user = await getCMUBasicInfo(access_token);

  // save to the database
  // const result = await User.insertOne(user);

  // return user_id
  // req.session.user_id = result.data.user_id;

  res.send(access_token);
});

router.get("/get-user", async function (req, res) {
  const token = req.session.token;
  if (token) {
    res.send(token);
  }

  res.send("not found access token");
});

router.get('/profile', async function(req,res){
  const user_id = req.session.user_id;

})

export default router;
