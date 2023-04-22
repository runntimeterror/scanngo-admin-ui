import React from "react";
import QRCode from "react-qr-code";

function ClientQRCode(props) {
  const { clientId } = props;
  return <QRCode value={clientId} />;
}

export default ClientQRCode;
