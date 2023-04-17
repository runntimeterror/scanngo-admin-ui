import { API_DOMAIN } from "../../../utils";
import { getCookie } from "cookies-next";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { token } = req.body;
  const sessionId = getCookie("sessionId", { req, res });
  let clientId = getCookie("storeId", { req, res });
  if (!clientId) {
    clientId = sessionId;
  }
  const resp = await fetch(`${API_DOMAIN}/analytics?range=60`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Session-Id": sessionId,
      "Client-Id": clientId,
      Authorization: `Bearer ${token}`,
    },
  });
  if (resp.status === 200) {
    const overviewResp = await resp.json();
    return res.status(200).json(overviewResp);
  }

  return res.status(resp.status).json({});
}

export default handler;
