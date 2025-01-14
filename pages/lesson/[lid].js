import { useTimer } from "@/context/timer-context";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// 模擬以動態路由存取於資料庫的課程內容

const Lesson = () => {
  const { timeLeft, addTime, reset } = useTimer();
  const router = useRouter();
  const  {lid} = router.query;
  const [lessonData, setLessonData] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isAlerting, setIsAlerting] = useState(false);

  useEffect(() => {
    // 還沒成功會先跳這個
    if (!router.isReady) return console.log('what!');
    console.log(`恩人，終於來到第${lid}課`);

    // 從假資料 API 中取得資料
    const fetchData = async () => {
        try {
          const res = await fetch("/api/lessons");
          if (!res.ok) throw new Error("API Error");
          const data = await res.json();
          
          setLessonData(data);
          console.log(data);
        
        const lesson = data.find((lesson) => lesson.lid === parseInt(lid));
        // 確認抓到什麼
        // console.log('現在',lesson);
        // console.log(lid);
        // console.log(router.query);

// 買保險
        if (!lesson) {
          setCurrentLesson({ description: "找不到對應的課程資料" });
        } else {
          setCurrentLesson(lesson);
          console.log('現在',lesson);
        }
        } catch (err) {
          console.error(err);
          setLessonData({ description: "無法載入資料" });
        }
      };
    

    fetchData();
    // 依賴這些資訊更新
  }, [router.isReady, lid]);

  useEffect(() => {
    // 到0的時候詢問一次
    // 取消只會再問一次
    if (timeLeft === 0 && !isAlerting) {
      setIsAlerting(true);
      Swal.fire({
        title: "再加一節",
        text: "時間到，是否重置計時？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "重置",
      }).then((result) => {
        if (result.isConfirmed) reset();
        setIsAlerting(false);
      });
    }
  }, [timeLeft, isAlerting, reset]);
// console.log(lessonData)

// 以接收到的資料進行map並以lid當作key
  const buttons = lessonData.map((lesson) => (

    <button
      key={lesson.lid}
      disabled={String(lesson.lid) === lid}
      className={`px-4 py-2 m-2 ${
        String(lesson.lid) === lid ? "bg-gray-400" : "bg-blue-500"
      } text-white rounded`}

    >
      {String(lesson.lid) === lid ? (
    `Lesson ${lesson.lid}`
  ) : (
    <Link href={`/lesson/${lesson.lid}`}>Lesson {lesson.lid}</Link>
  )}
    </button>
    
  ));

  return (
    // 使用tailwind的樣式編排
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl mb-4">
        歡迎，這是第{lid}課
      </h1>
      {/* 避免臨時抓不太到 */}
      <p className="text-xl">{currentLesson?.description || "載入中..."}</p>
      <div className="text-xl mt-4">倒數時間：{timeLeft} 秒</div>

      <div className="flex mt-4">
        {/* 觸發hook的reducer */}
        <button
          className="px-4 py-2 m-2 bg-green-500 text-white rounded"
          onClick={() => addTime(10)}
        >
          +10秒
        </button>
        <button
          className="px-4 py-2 m-2 bg-red-500 text-white rounded"
          onClick={() => addTime(-10)}
        >
          -10秒
        </button>
        <button
          className="px-4 py-2 m-2 bg-blue-500 text-white rounded"
          onClick={reset}
        >
          重置
        </button>
      </div>
      <div className="flex mt-8">{buttons}</div>
      {/* 利用路由回到首頁 */}
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 mt-4 bg-gray-500 text-white rounded"
      >
        返回首頁
      </button>

    </div>
  );
};

export default Lesson;
