import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useSearchParams } from "react-router-dom";

export default function Questions() {
  const [params] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const exam = params.get("exam");
  const subject = params.get("subject");
  const year = params.get("year");
  const type = params.get("type");

  useEffect(() => {
    if (!exam || !subject || !year) return;

    apiFetch(
      `/public/questions?exam=${exam}&subject=${subject}&year=${year}&type=${type}`
    )
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [exam, subject, year, type]);

  if (loading) return <p>Loading questions...</p>;

  return (
    <div>
      {questions.map((q, i) => (
        <div key={q._id} style={card}>
          <p>
            <strong>
              {i + 1}. {q.text}
            </strong>
          </p>

          {q.images?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="question"
              style={{ width: "100%", marginTop: 8 }}
            />
          ))}

          {q.type === "Objective" &&
            q.options.map((o, idx) => (
              <div key={idx}>
                {String.fromCharCode(65 + idx)}. {o}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

const card = {
  padding: 16,
  background: "#020617",
  marginBottom: 12,
  borderRadius: 8,
};