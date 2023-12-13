import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import { getOAuthAccessToken, getCMUBasicInfo } from "../OAuthFunct.js";
import session from "express-session";

// @description POST sign in user
// @route POST /api/users/signIn
// @access private

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

const OAuthCallback = asyncHandler(async (req, res, next) => {
  const code = req.query.code;

  if (!code) {
    res.status(400);
    throw new Error(`Invalid authorization code ${code}`);
  }
  
  res.redirect('/signIn/?valid=' + code);
});

export { signInUser, OAuthCallback };
