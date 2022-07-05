import { AppProps } from "next/app";
import { AppProvider } from "providers";

import "react-quill/dist/quill.snow.css";

if (process.env.NEXT_PUBLIC_MOCK === "true") {
  require("mocks/index");
}

const MyApp: React.VFC = ({ Component, pageProps }: AppProps) => {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
};

export default MyApp;
