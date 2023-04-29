import { API_DOMAIN } from "../../../utils";
import { getCookie } from "cookies-next";

async function handler(req, res) {
  const sessionId = getCookie("sessionId", { req, res });
  if (req.method === "POST") {
    //handle client create
    const { payload, token } = req.body;
    const resp = await fetch(`${API_DOMAIN}/client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (resp.status === 200) {
      const clientResp = await resp.json();
      return res.status(200).json(clientResp);
    }
    return res.status(resp.status).json({});
  } else if (req.method === "GET") {
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
}

export default handler;
