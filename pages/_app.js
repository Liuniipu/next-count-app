import "../styles/globals.css";
import { TimerProvider } from "../context/timer-context";

export default function App({ Component, pageProps }) {
  return (
    <TimerProvider>
      <Component {...pageProps} />
    </TimerProvider>
  );
}
