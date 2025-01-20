import jwt from "jsonwebtoken";

const isVerified = (req, res, next) => {
  try {
    
    // Fetching the Token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User Not Logged In",
      });
    }

    // Verifying the Token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "User Not Logged In",
      });
    }

    // Adding the User to the Request
    req.id = decode.userId;
    next();

    
  } catch (error) {
    console.log("Error While Verifying the User", error);
    return res.status(401).json({
      success: false,
      message: "Error While Verifying the User",
    });
  }
};

export default isVerified;