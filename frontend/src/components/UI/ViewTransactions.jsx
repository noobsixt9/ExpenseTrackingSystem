import React from "react";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { formatCurrency } from "../../libs";
import { PiSealCheckFill } from "react-icons/pi";

const ViewTransactions = ({ data, isOpen, setIsOpen }) => {
  function closeModal() {
    setIsOpen(false);
  }

  const longDateString = new Date(data?.createdat).toLocaleDateString("en-US", {
    dateStyle: "full",
  });

  const longTimeString = new Date(data?.createdat).toLocaleTimeString("en-US");

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel
        as="div"
        className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase bg-white dark:bg-slate-800 rounded-lg p-6"
      >
        <DialogTitle>Transaction Detail</DialogTitle>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-500 border-y border-gray-300 dark:border-gray">
            <p>{data?.source}</p>
            <PiSealCheckFill size={30} className="text-emerald-500 ml-4" />
          </div>
          <div className="mb-10">
            <p className="text-xl text-black dark:text-white">
              {data?.description}
            </p>
            <span className="text-xs text-gray-500">
              {longDateString}
              {longTimeString}
            </span>
          </div>
        </div>
        <div className="mt-10 mb-3 flex justify-between">
          <p className="text-black dark:text-gray-400 text-2xl font-bold">
            <span
              className={`${
                data?.type === "income" ? "text-emerald-600" : "text-red-600"
              } font-bold mgl-1`}
            >
              {data?.type === "Income" || data?.source === "Income"
                ? "+ "
                : "-"}
            </span>{" "}
            {formatCurrency(data?.amount)}
          </p>
          <button
            type="button"
            className="rounded-md outline-none bg-violet-800 px-4 py-2 text-sm font-medium text-white"
            onClick={closeModal}
          >
            Got it
          </button>
        </div>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default ViewTransactions;
