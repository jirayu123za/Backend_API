import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { /*signInUser,*/ OAuthCallback, userInfo } from "../controllers/OAuthController.js";

const router = express.Router();

// router.post("/signIn", signInUser);
// router.get('/signIn', function (req, res) {
//     res.send('Welcome jjj');
// })
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
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

router.get('/profile', async function(req,res){
  //  const user_id = req.session.user_id;
  // res.send("profile page");
  // console.log(res);

})

export default router;
