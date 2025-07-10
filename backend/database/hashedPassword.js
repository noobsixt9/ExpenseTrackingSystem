import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

export const hashedPassword = async (userValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashpassword = await bcrypt.hash(userValue, salt);
  return hashpassword;
};

export const comparePassword = async (userPassword, password) => {
  try {
    const isMatch = await bcrypt.compare(userPassword, password);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};

export const createJwt = (id) => {
  return JWT.sign(
    {
      userId: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export function getMonthName(index) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "Novemeber",
    "December",
  ];
  return months[index];
}
