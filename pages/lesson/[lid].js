import { useTimer } from "@/context/timer-context";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Lesson = () => {
  const { timeLeft, addTime, reset } = useTimer();
  const router = useRouter();
  const { id } = router.query;
  const [lessonData, setLessonData] = useState(null);
  const [isAlerting, setIsAlerting] = useState(false);

  useEffect(() => {
    if (!id) return;
    console.log(`恩人，終於來到第${id}課`);

    // 模擬從假資料 API 中取得資料
    const fetchData = async () => {
        try {
          const res = await fetch("/api/lessons");
          if (!res.ok) throw new Error("API Error");
          const data = await res.json();
          const currentLesson = data.find((lesson) => lesson.lid === parseInt(id));
          setLessonData(currentLesson);
        } catch (err) {
          console.error(err);
          setLessonData({ description: "無法載入資料" });
        }
      };
    

    fetchData();
  }, [id]);

  useEffect(() => {
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

  const buttons = [1, 2, 3, 4, 5].map((lid) => (
    <button
      key={lid}
      disabled={String(lid) === id}
      className={`px-4 py-2 m-2 ${
        String(lid) === id ? "bg-gray-400" : "bg-blue-500"
      } text-white rounded`}
    >
      <Link href={`/lesson/${lid}`}>Lesson {lid}</Link>
    </button>
  ));

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl mb-4">
        歡迎，這是第{id}課
      </h1>
      <p className="text-xl">{lessonData?.description || "載入中..."}</p>
      <div className="text-xl mt-4">倒數時間：{timeLeft} 秒</div>
      <div className="flex mt-4">
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
