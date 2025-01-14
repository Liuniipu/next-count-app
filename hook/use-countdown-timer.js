import { useEffect, useReducer } from "react";

// 以reducer將預選的方案列出
const timerReducer = (state, action) => {
  switch (action.type) {
    case "TICK":
      return { ...state, timeLeft: Math.max(state.timeLeft - 1, 0) };
    case "ADD_TIME":
      return { ...state, timeLeft: state.timeLeft + action.payload };
    case "RESET":
      return { ...state, timeLeft: 300 };
    case "SET_TIME":
      return { ...state, timeLeft: action.payload };
    default:
      return state;
  }
};

// 預設時間
const useCountdownTimer = (defaultTime=300) => {
  const [state, dispatch] = useReducer(timerReducer, {
    defaultTime,
    timeLeft: defaultTime,
  });

  // 為了關閉視窗後持續運行，將其存至localstorage
  // 初次從 localStorage 獲取計時器狀態
  useEffect(() => {
    const savedTimeLeft = parseInt(localStorage.getItem("timeLeft"), 10);
    const savedTimestamp = parseInt(localStorage.getItem("timestamp"), 10);

    if (savedTimeLeft && savedTimestamp) {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - savedTimestamp) / 1000);
      const updatedTimeLeft = Math.max(savedTimeLeft - elapsedTime, 0);

      dispatch({ type: "SET_TIME", payload: updatedTimeLeft });
    }
  }, []);

  // 每次狀態更新時保存到 localStorage
  useEffect(() => {
    localStorage.setItem("timeLeft", state.timeLeft);
    localStorage.setItem("timestamp", Date.now());
  }, [state.timeLeft]);

  // 每秒減少計時器
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

// 確保重置計時器不受 localStorage 影響
const reset = () => {
  dispatch({ type: "RESET" });
  localStorage.setItem("timeLeft", defaultTime);
    localStorage.setItem("timestamp", Date.now());
};


  return {
    timeLeft: state.timeLeft,
    addTime: (seconds) => dispatch({ type: "ADD_TIME", payload: seconds }),
    reset,
  };
};

export default useCountdownTimer;
