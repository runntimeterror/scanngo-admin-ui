import jwt from "jsonwebtoken";
import { API_DOMAIN } from "../../../utils";
import { serialize } from "cookie";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;
  const loginPayload = { email: username, password };
  const resp = await fetch(`${API_DOMAIN}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginPayload),
  });
  if (resp.status === 200) {
    const user = await resp.json();
    const token = jwt.sign(
      { username: user.username, accessLevel: user.accessLevel.toString() },
      process.env.REACT_APP_JWT_SECRET,
      {
        expiresIn: "1y",
      }
    );
    const cookie = serialize("clientId", user.clientId, {
      httpOnly: true,
      path: "/",
    });
    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ token });
  }
  return res.status(401).json({ message: "Invalid credentials" });

  /*
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // TODO: replace this with a call to a database
  const user = { username, hashedPassword };

  if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  */
}

export default handler;
