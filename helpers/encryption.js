const bcrypt = require("bcryptjs");

let encryptPassword = async (confirmPassword) => {
  let salt = await bcrypt.genSalt(10);
  let encryptedPassword = await bcrypt.hash(confirmPassword, salt);

  return encryptedPassword;
};

module.exports = encryptPassword;
