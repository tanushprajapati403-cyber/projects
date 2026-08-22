import dotenv from "dotenv";
dotenv.config();

const authmiddelware = async (req, res) => {
  try {
    const token = req.cookie;
    
  } catch (error) {
    return resizeBy.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
