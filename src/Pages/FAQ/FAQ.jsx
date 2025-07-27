import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../Components/Sheared/Loading";
import WrapContainer from "../../Components/AnimateCompnent/WrapContainer";
import WrapItem from "../../Components/AnimateCompnent/WrapItem";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("/faq.json").then((res) => {
      setFaqs(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <WrapContainer>
      <title>FAQS</title>
      <div className="w-11/12 max-w-4xl my-20 p-4 mx-auto bg-white rounded-2xl shadow-md">
        <h2 className="text-5xl font-bold text-center mb-6 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <WrapItem key={index}>
              <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title font-semibold">
                  {faq.question}
                </div>
                <div className="collapse-content text-sm">{faq.answer}</div>
              </div>
            </WrapItem>
          ))}
        </div>
      </div>
    </WrapContainer>
  );
};

export default FAQ;
