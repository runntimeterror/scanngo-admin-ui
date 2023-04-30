import { API_DOMAIN } from "../../../utils";
import { getCookie } from "cookies-next";

const endpoint = "inventory";

async function handler(req, res) {
  console.log("req", req.headers);
debugger
  const sessionId = getCookie("sessionId", { req, res });
  const clientId = req.headers["client-id"] || getCookie("clientId", { req, res });

  const headers = new Headers({
    "Content-Type": "application/json",
    "Session-Id": sessionId,
    "Client-Id": clientId,
    Authorization: req.headers.authorization,
  });
  console.log("headers", JSON.stringify(Object.fromEntries([...headers])));

  const request = req.body;
  let resp;
  if (req.method === "GET") {
    resp = await fetch(`${API_DOMAIN}/` + endpoint, {
      method: req.method,
      headers: headers,
    });
  } else if (req.method === "POST") {
    resp = await fetch(`${API_DOMAIN}/` + endpoint, {
      method: req.method,
      headers: headers,
      body: request,
    });
  }
  const body = await resp.json();
  return res.status(200).json(body);
}

export default handler;
