import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import { getOAuthAccessToken, getCMUBasicInfo } from "../OAuthFunct.js";
import session from "express-session";
import User from "../models/userModel.js";

// @description POST sign in user
// @route POST /api/users/signIn
// @access private

/*
const signInUser = asyncHandler(async (req, res, next) => {
  const authorizationCode = req.body.authorizationCode;

  if (req.method !== "POST") {
    res.status(404);
    throw new Error(`Invalid HTTP method ${req.method}`);
  }

  if (typeof authorizationCode !== "string") {
    res.status(400);
    throw new Error(`Invalid authorization code ${authorizationCode}`);
  }

  try {
    const accessToken = await getOAuthAccessToken(authorizationCode);
    if (!accessToken) {
      res.status(400);
      throw new Error(`Can not get access token ${accessToken}`);
    }

    res.send(`Access token: ${accessToken}`);

    // const cmuBasicInfo = await getCMUBasicInfo(accessToken);
    // if (!cmuBasicInfo) {
    //   res.status(400);
    //   throw new Error(`Can not get basic info ${cmuBasicInfo}`);
    // }

    // const tokenPayload = {
    //   accountType: cmuBasicInfo.itaccounttype_EN,
    //   cmuAccount: cmuBasicInfo.cmuitaccount,
    //   firstName: cmuBasicInfo.firstname_TH,
    //   lastName: cmuBasicInfo.lastname_TH,
    //   organization: cmuBasicInfo.organization_name_TH,
    // };

    // const token = generateToken(tokenPayload);
    // console.log(token);
  } catch (error) {
    res.status(500);
    throw new Error(`Internal server error ${error}`);
  }
});
*/

const OAuthCallback = asyncHandler(async (req, res, next) => {
  const code = req.query.code;

  if (!code) {
    res.status(400);
    throw new Error(`Invalid authorization code ${code}`);
  }

  res.redirect("/signIn/?valid=" + code);
});

const userInfo = asyncHandler(async (req, res, next) => {
  const code = req.query.valid;
  const access_token = await getOAuthAccessToken(code);
  const user = await getCMUBasicInfo(access_token);
  // log cmu basic info from access token
  console.log("getCMUBasicInfo: ", (user));

  //! Maybe can set it to jwt session
  const information = {
    accountType: user.itaccounttype_EN,
    name: user.firstname_EN + " " + user.lastname_EN,
    email: user.cmuitaccount,
    organization: user.organization_name_EN,
    organizationCode: user.organization_code,
  };

  const { accountType, name, email, organization, organizationCode } = information;
  // log information about the account
  console.log("information: ", information);

  //! Check if the user already exists
  try {
    const existingUser = await User.findOne({
      name: user.cmuitaccount_name,
      email: user.cmuitaccount,
    });

    if (existingUser) {
      res.send(existingUser);
      console.log("existingUser: " + (existingUser));
    } else {
      //! save to the database
      const newUser = await User.create({
        accountType,
        name,
        email,
        organization,
        organizationCode,
      });
      res.json(newUser);
      console.log("newUser: " + (newUser));
    }
  } catch (error) {
    console.log(error);
    //throw new Error(`Cannot find user || Cannot save user`);
  }

  /*
  try{
    const user = await User.findOne({
      name: "jirayu jitprem",
      email: "jirayu_jitprem@cmu.ac.th",
    });

    if(user.role === "USER"){
      await User.updateOne({ role: "ADMIN" });
      res.json({ role: "ADMIN" });
      console.log("user role updated to ADMIN");
    }else{
      res.json(user);
      console.log("user role is already ADMIN");
    }
  }catch(error){
    throw new Error(`Cannot update user role`);
  }
  */
});

export { OAuthCallback, userInfo };
