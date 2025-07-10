import { pool } from "../database/database.js";
import {
  hashedPassword,
  comparePassword,
  createJwt,
} from "../database/hashedPassword.js";

export const registerUser = async (req, res) => {
  try {
    const { email, firstname, lastname, password, contact } = req.body;

    // server side validations
    if (!firstname || !lastname || !contact || !email || !password) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Please provide all the required fields.",
      });
    }
    // check if user already exists or not
    const userExist = await pool.query({
      text: `SELECT EXISTS (SELECT * FROM tbluser WHERE email = $1)`,
      values: [email],
    });

    if (userExist.rows[0].exists) {
      return res.status(409).json({
        status: "Conflict",
        message: "User already exist with that email. Try logging in",
      });
    }

    const encryptedPassword = await hashedPassword(password);

    const user = await pool.query({
      text: `INSERT INTO tbluser (firstname, lastname, contact, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      values: [firstname, lastname, contact, email, encryptedPassword],
    });

    user.rows[0].password = undefined;
    res.status(201).json({
      status: "Success",
      message: "User Created",
      user: user.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query({
      text: `SELECT * FROM tbluser WHERE email=$1`,
      values: [email],
    });

    const user = result.rows[0];
    if (!user) {
      return res.status(403).json({
        status: "Failed",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await comparePassword(password, user?.password);
    if (!isMatch) {
      return res.status(403).json({
        status: "Failed",
        message: "Invalid email or password.",
      });
    }
    const token = createJwt(user.id);
    const { password: userPassword, uid, ...safeUser } = user;
    res.status(200).json({
      status: "Sucess",
      message: "Login Sucessful",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const registerOauth = async (req, res) => {
  try {
    const { firstname, lastname, email, provider, uid } = req.body;

    if (!firstname || !lastname || !email || !provider || !uid) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Please provide all of the required fields.",
      });
    }
    const userExist = await pool.query({
      text: `SELECT EXISTS (SELECT * FROM tbluser WHERE email= $1)`,
      values: [email],
    });

    if (userExist.rows[0].exists) {
      return res.status(409).json({
        status: "Conflict",
        message: "User already exist with that email. Try logging in.",
      });
    }
    const normalizedEmail = email.toLowerCase();
    const user = await pool.query({
      text: `INSERT INTO tbluser (firstname, lastname, email, provider, uid) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      values: [firstname, lastname, normalizedEmail, provider, uid],
    });

    const { uid: userUid, ...safeUser } = user.rows[0];
    res.status(201).json({
      status: "Success",
      message: "User Created",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export const loginOauth = async (req, res) => {
  try {
    const { firstname, lastname, email, provider, uid } = req.body;

    if (!firstname || !lastname || !email || !provider || !uid) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Please provide all of the required fields.",
      });
    }
    const result = await pool.query({
      text: `SELECT * FROM tbluser WHERE email= $1`,
      values: [email],
    });

    const user = result.rows[0];
    if (!user) {
      return res.status(403).json({
        status: "Failed",
        message: "Invalid email or password.",
      });
    }
    if (uid !== user.uid) {
      return res.status(403).json({
        status: "Failed",
        message: "Invalid email or password.",
      });
    }
    const token = createJwt(user.id);
    const { password, uid: userUid, ...safeUser } = user;
    res.status(200).json({
      status: "Sucess",
      message: "Login Sucessful",
      user: safeUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
