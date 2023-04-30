import { API_DOMAIN } from "../../../../utils";
import { getCookie } from "cookies-next";

const endpoint = "product";

async function handler(req, res) {
  const sessionId = getCookie("sessionId", { req, res });
  let clientId = getCookie("clientId", { req, res });
  if (!clientId) {
    clientId = sessionId;
  }
  const headers = {
    "Content-Type": "application/json",
    "Session-Id": sessionId,
    "Client-Id": clientId,
    Authorization: req.headers.authorization,
  };
  const { id } = req.query;
  const resp = await fetch(`${API_DOMAIN}/` + endpoint + "/" + id, {
    method: req.method,
    headers: headers,
  });
  debugger
  const body = await resp.json();
  return res.status(resp.status).json(body);
}

export default handler;
