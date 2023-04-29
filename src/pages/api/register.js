import bcrypt from "bcryptjs";
import { API_DOMAIN } from "../../../utils";
import { getCookie } from "cookies-next";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const sessionId = getCookie("sessionId", { req, res });
  const { userName, password, clientId, token, email } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const resp = await fetch(`${API_DOMAIN}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Session-Id": sessionId,
      "Client-Id": clientId

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
