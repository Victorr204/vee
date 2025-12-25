import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Question() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    api.get(`/questions/${id}`).then((res) => {
      setQuestion(res.data);
    });
  }, [id]);

  if (!question) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{question.subject}</h2>
      <p>{question.question_text}</p>

      {question.answer_text ? (
        <p><strong>Answer:</strong> {question.answer_text}</p>
      ) : (
        <p>🔒 Activate to view answer</p>
      )}
    </div>
  );
}
