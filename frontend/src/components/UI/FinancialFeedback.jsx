import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { Button, DialogPanel, DialogTitle } from "@headlessui/react";
import api from "../../libs/apiCall";
import { toast } from "sonner";
import Loading from "./loading";

const FinancialFeedback = ({ isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const getFeedback = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get("/gemini/financial-feedback");
      if (res?.data) {
        setFeedback(res.data);
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
        >
          AI Financial Report
        </DialogTitle>
        <div className="mt-2">
          {loading ? (
            <Loading />
          ) : (
            <>
              {feedback && (
                <div className="text-gray-700 dark:text-gray-400 text-sm mb-4">
                  <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
              )}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-500 mb-4">
                  {feedback
                    ? "Click the button again to regenerate your financial report."
                    : "Click the button below to get your personalized financial feedback."}
                </p>
                <Button
                  onClick={getFeedback}
                  className="bg-violet-700 text-white cursor-pointer"
                >
                  {feedback ? "Regenerate AI Financial Report" : "Get AI Financial Report"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default FinancialFeedback;
