import validator from "validator";

const sanitizeUsername = (username: string) => {
  username = username.trim();
  username = validator.whitelist(username, "A-Za-z0-9_");
  if (!validator.isLength(username, { min: 3, max: 30 })) {
    return {
      isError: true,
      username,
    };
  }

  return {
    isError: false,
    username,
  };
};

const sanitizePassword = (password: string) => {
  password = password.trim();
  if (!validator.isLength(password, { min: 6, max: 128 })) {
    return {
      isError: true,
      password,
    };
  }
  return {
    isError: false,
    password,
  };
};

export { sanitizePassword, sanitizeUsername };
