import React, { useEffect, useState } from "react";
import "../misc/helpcentre.css";
import { fetchQuestionsAPI } from "../api/manageQAPI";
import Breadcrumb from "../components/ui/Breadcrumb";

const Helpnotlog = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestionsAPI();
        if (Array.isArray(fetchedQuestions)) {
          setQuestions(fetchedQuestions);
        } else {
          console.error("Fetched questions is not an array");
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    };

    loadQuestions();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredFaqs = questions.filter((faq) =>
    faq.topic.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="help-centre">
      {/* ยังไม่ล็อกอิน — หน้าแรกคือหน้า Landing · ใช้ breadcrumb แทนปุ่มย้อนกลับ */}
      <Breadcrumb
        homeTo="/"
        className="tw:mb-4 tw:w-full tw:max-w-[600px]"
        items={[{ label: "ศูนย์ช่วยเหลือ" }]}
      />

      {/* FAQ Section */}
      <div className="faq">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <details>
                <summary className="faq-question">{faq.topic}</summary>
                <div className="faq-answer">{faq.answer}</div>
              </details>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Helpnotlog;
