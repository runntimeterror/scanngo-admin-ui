import { API_DOMAIN } from "../../../../utils";

const headers = {
  "Client-Id": "d4952489-d57c-11ed-ab65-062dad11b3d9",
  "Session-Id": "d4952489-d57c-11ed-ab65-062dad11b3d9",
  "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2ODE2MDA0NzEsImV4cCI6MTcxMzEzNjQ3MSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiYXNkYXNkIiwiYWNjZXNzTGV2ZWwiOiIxIn0.teOTq_cdmCNlRuJ0tl88ffYdzGVLxv-sO6o47jydZc4"
}
const endpoint = 'product'

async function handler(req, res) {
  const request = req.body;
  let resp
  const { id } = req.query
  resp = await fetch(`${API_DOMAIN}/` + endpoint + '/' + id, {
    method: req.method,
    headers: headers,
    body: request,
  });
  const body = await resp.json();
  return res.status(200).json(body);
}

export default handler;
