import bcrypt from 'bcryptjs';
import { API_DOMAIN } from "../../../utils";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log(`Registering user: ${username}, ${hashedPassword}`);
  const resp = await fetch(`${API_DOMAIN}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({userName: username, hashedPassword: hashedPassword}),
  });

  return res.status(201).json({ message: 'User registered successfully' });
}

export default handler;
