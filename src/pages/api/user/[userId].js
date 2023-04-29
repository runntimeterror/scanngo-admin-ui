import { API_DOMAIN } from "../../../../utils";

async function handler(req, res) {
  if (req.method === "POST") {
    const query = req.query;
    const { userId } = query;
    //handle client delete
    const { token, clientId } = req.body;
    const resp = await fetch(`${API_DOMAIN}/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Client-Id": clientId
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
