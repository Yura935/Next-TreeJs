import { useEffect, useState } from "react";
import { MpSdk } from "../../public/bundle/sdk";

declare global {
    interface Window {
      MP_SDK?: {
        connect: (window: Window) => Promise<MpSdk>;
      };
    }
  }

export const useMPSdk = () => {
  const [mpSdk, setMpSdk] = useState<MpSdk>();

  useEffect(() => {
    const showcase = document.getElementById("showcase") as HTMLIFrameElement;
    if (!showcase) return;

    const showcaseWindow = showcase.contentWindow;

    const loadSdk = async () => {
      try {
        const sdk = await showcaseWindow?.MP_SDK?.connect(showcaseWindow);
        setMpSdk(sdk);
      } catch (e) {
        console.error("SDK connection failed:", e);
      }
    };

    showcase.addEventListener("load", loadSdk);

    return () => {
      showcase.removeEventListener("load", loadSdk);
    };
  }, []);

  return mpSdk;
};
