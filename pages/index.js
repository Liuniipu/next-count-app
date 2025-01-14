import Link from "next/link";
import { useRouter } from "next/router";
import { useTimer } from "@/context/timer-context";


const Home = () => {
  const router = useRouter();
  const currentId = router.query.id;
  const { timeLeft, addTime, reset } = useTimer();



  
  // 以map搭配key將預設的五個課程列出
  const buttons = [1, 2, 3, 4, 5].map((id) => (
    <button
      key={id}
      className="bg-blue-500 px-4 py-2 m-2 text-white rounded"
    >
      <Link href={`/lesson/${id}`}>Lesson {id}</Link>
    </button>
  ));

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl mb-4">歡迎</h1>
      <p className="text-xl">放心，這裡不會強制要求加時</p>

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

   
    </div>
  );
};

export default Home;
