import { API_DOMAIN } from "../../../utils";
import { getCookie } from "cookies-next";

async function handler(req, res) {
  const sessionId = getCookie("sessionId", { req, res });
  const resp = await fetch(`${API_DOMAIN}/client`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Session-Id": sessionId,
    },
  });
  if (resp.status === 200) {
    const clientResp = await resp.json();
    return res.status(200).json(clientResp);
  }

  return res.status(resp.status).json({});
}

export default handler;
