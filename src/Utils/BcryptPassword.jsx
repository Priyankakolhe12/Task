import bycrpt from "bcryptjs";

export const hashPassword = async (password) => {
  if (!password) return null;
  const salt = await bycrpt.genSalt(10);
  return await bycrpt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) return false;
  return await bycrpt.compare(password, hashedPassword);
};
