import { API_DOMAIN } from "../../../utils";
import { getCookie } from "cookies-next";

async function handler(req, res) {
  console.log('req', req.headers);

  const sessionId = getCookie("sessionId", { req, res });
  let clientId = getCookie("clientId", { req, res });
  if (!clientId) {
    clientId = sessionId;
  }
  const headers = new Headers({
    "Content-Type": "application/json",
    "Session-Id": sessionId,
    "Client-Id": clientId,
    Authorization: req.headers.authorization
  });

  const request = req.body;
  let resp
  if (req.method === 'GET') {
    resp = await fetch(`${API_DOMAIN}/product`, {
      method: req.method,
      headers: headers
    });
  }
  else if (req.method === 'POST') {
    resp = await fetch(`${API_DOMAIN}/product`, {
      method: req.method,
      headers: headers,
      body: JSON.stringify(request),
    });
  }
  if(resp.status === 200) {
    const body = await resp.json();
    return res.status(resp.status).json(body);
  }
  return res.status(resp.status).json("something went wrong")
}

export default handler;
