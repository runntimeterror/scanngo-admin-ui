import { Html5Qrcode } from "html5-qrcode";
import React from "react";

const qrcodeRegionId = "html5qr-code-full-region";

class Html5QrcodePlugin extends React.Component {
  render() {
    return <div id={qrcodeRegionId} />;
  }

  componentWillUnmount() {
    this.html5QrcodeScanner.stop().catch((error) => {
      console.error("Failed to clear html5QrcodeScanner. ", error);
    });
  }

  componentDidMount() {
    // Creates the configuration object for Html5QrcodeScanner.
    function createConfig(props) {
      var config = {};
      config.rememberLastUsedCamera = true;
      config.supportedScanTypes = 0;
      if (props.fps) {
        config.fps = props.fps;
      }
      if (props.qrbox) {
        config.qrbox = props.qrbox;
      }
      if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
      }
      if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
      }
      return config;
    }

    var config = createConfig(this.props);

    // Suceess callback is required.
    if (!this.props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }

    this.html5QrcodeScanner = new Html5Qrcode(qrcodeRegionId, config);
    this.html5QrcodeScanner.start(
      { facingMode: "environment" },
      config,
      this.props.qrCodeSuccessCallback,
      this.props.qrCodeErrorCallback
    );
  }
}

export default Html5QrcodePlugin;
