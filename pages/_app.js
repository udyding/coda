import { Provider } from "next-auth/client";

function CodaApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default CodaApp;
