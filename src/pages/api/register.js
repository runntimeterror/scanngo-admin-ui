import bcrypt from "bcryptjs";
import { API_DOMAIN } from "../../../utils";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userName, password, clientId, token, email } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log(
    `Registering user: ${JSON.stringify({
      userName,
      password: hashedPassword,
      clientId,
      email,
    })}`
  );
  const resp = await fetch(`${API_DOMAIN}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userName,
      password: hashedPassword,
      clientId,
      email,
    }),
  });
  if (resp.status === 200) {
    const clientResp = await resp.json();
    return res.status(200).json(clientResp);
  }
  return res.status(resp.status).json({});
}

export default handler;
