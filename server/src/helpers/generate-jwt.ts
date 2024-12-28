import jwt from "jsonwebtoken";

export async function generateJWT(user: any) {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN as string;

  const token = jwt.sign(
    { userInfo: { id: user._id, email: user.email, name: user.name } },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  return token;
}
