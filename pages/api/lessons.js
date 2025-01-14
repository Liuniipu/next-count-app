import lessons from "@/data/lessons.json";

export default function handler(req, res) {
  res.status(200).json(lessons);
}
