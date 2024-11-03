const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({
      data: { user, token },
      success: true,
      error: null,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      data: null,
      success: false,
      error: error.message,
      message: "Error registering user",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    res.status(200).json({
      data: { user, token },
      success: true,
      error: null,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(400).json({
      data: null,
      success: false,
      error: error.message,
      message: "Error logging in user",
    });
  }
};

module.exports = { register, login };
