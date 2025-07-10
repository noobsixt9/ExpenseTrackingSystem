import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../libs/apiCall";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { Button, DialogPanel, DialogTitle } from "@headlessui/react";
import { formatCurrency } from "../../libs";
import Input from "./input";
import { toast } from "sonner";

const AddMoney = ({ isOpen, setIsOpen, id, refetch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.put(`/account/add-money/${id}`, data);
      if (res?.data) {
        toast.success(res?.message);
        setIsOpen(false);
        refetch();
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
      <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
        >
          Add Money to Account
        </DialogTitle>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <Input
            type="number"
            name="amount"
            label="Amount"
            placeholder="10.56"
            className="inputStyle"
            {...register("amount", {
              required: "Amount is required!",
              validate: (val) => {
                return val > 0 || "Amount can't be 0 or less";
              },
            })}
            error={errors.amount ? errors.amount.message : ""}
          />

          <div className="w-full mt-8">
            <Button
              disabled={loading}
              type="submit"
              className="bg-violet-700 text-white w-full cursor-pointer"
            >
              {`Add ${watch("amount") ? formatCurrency(watch("amount")) : ""}`}
            </Button>
          </div>
        </form>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default AddMoney;
