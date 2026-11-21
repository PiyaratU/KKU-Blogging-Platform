import React, { useEffect, useState } from "react";
import "../misc/helpcentre.css";
import { fetchQuestionsAPI } from "../api/manageQAPI";
import Breadcrumb from "../components/ui/Breadcrumb";

const HelpCentre = () => {
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

  // If searchQuery is empty, don't filter and return all questions.
  const filteredFaqs = searchQuery
    ? questions.filter((faq) =>
        faq.topic.toLowerCase().includes(searchQuery)
      )
    : questions; // Show all questions when there's no search query.

  return (
    <div className="help-centre">
      {/* ใช้ breadcrumb แทนปุ่มย้อนกลับ · กว้างเท่ากล่อง FAQ (.faq max-width 600px) ชิดซ้าย */}
      <Breadcrumb
        className="tw:mb-4 tw:w-full tw:max-w-[600px]"
        items={[{ label: "ศูนย์ช่วยเหลือ" }]}
      />

      <header className="header">
        <h1>คำถามที่พบบ่อย</h1>
        <h2>เราสามารถช่วยคุณได้อย่างไรบ้าง?</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </header>

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
          <p>ไม่พบผลลัพธ์</p> // Show message when no search results match
        )}
      </div>
    </div>
  );
};

export default HelpCentre;
