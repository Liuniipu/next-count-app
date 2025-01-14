import { createContext, useContext } from "react";
import useCountdownTimer from "@/hook/use-countdown-timer";

const TimerContext = createContext();
// 以hook包覆子層
export const TimerProvider = ({ children }) => {
  const timer = useCountdownTimer(300);

  return (
    <TimerContext.Provider value={timer}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
