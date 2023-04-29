import { API_DOMAIN } from "../../../utils";

async function handler(req, res) {
  const { token, clientId } = req.body;

  const resp = await fetch(`${API_DOMAIN}/user/${clientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Client-Id": clientId
    },
  });
  if (resp.status === 200) {
    const userResp = await resp.json();
    return res.status(200).json(userResp);
  }
  return res.status(resp.status).json({});
}

export default handler;
