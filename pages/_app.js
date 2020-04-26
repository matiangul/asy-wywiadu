import App from "next/app";
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn:
    "https://1d01be2d122a4ed0bbc013898e90df81@o383352.ingest.sentry.io/5213412",
});

class MyApp extends App {
  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      for (const key in errorInfo) {
        scope.setExtra(key, errorInfo[key]);
      }
      Sentry.captureException(error);
    });
    super.componentDidCatch(error, errorInfo);
  }
}

export default MyApp;
