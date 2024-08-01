const bcrypt = require("bcryptjs");
let decryptPassword = async (password, hashedPassword) => {
  let isPasswordMatching = await bcrypt.compare(password, hashedPassword);
  return isPasswordMatching;
};

module.exports = decryptPassword;
