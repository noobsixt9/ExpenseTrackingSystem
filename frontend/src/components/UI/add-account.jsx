import useStore from "../../store";
import { generateAccountNumber } from "../../libs";
import { useForm } from "react-hook-form";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { Button, DialogPanel, DialogTitle } from "@headlessui/react";
import { MdOutlineWarning } from "react-icons/md";
import { React, useState } from "react";
import { BiLoader } from "react-icons/bi";
import Input from "./input";
import api from "../../libs/apiCall";
import { toast } from "sonner";

const accounts = ["Cash", "Crypto", "Paypal", "Visa Debit Card", "Bank"];

export const AddAccount = ({ isOpen, setIsOpen, refetch }) => {
  const { user } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      account_number: generateAccountNumber(),
    },
  });

  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [loading, setLoading] = useState(false);

  const customAccountName = watch("custom_account_name");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const accountNameToCreate = selectedAccount === "Cash" ? selectedAccount : (data.custom_account_name ? `${selectedAccount}:${data.custom_account_name}` : selectedAccount);
      const newData = { ...data, name: accountNameToCreate };
      const { data: res } = await api.post(`/account/create`, newData);
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

  const accountName =
    selectedAccount === "Cash"
      ? "Cash"
      : customAccountName
      ? `${selectedAccount}:${customAccountName}`
      : null;

  const isAccountAlreadyAdded =
    accountName && user?.accounts?.includes(accountName);

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
        >
          Add Account
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-1 mb-2">
            <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
              Select Account
            </p>
            <select
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="bg-transparent appearance-none border border-gray-300 dark:border-gray-800 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-500 outline-none focus:ring-1 ring-blue-500 dark:placeholder:text-gray-700"
            >
              {accounts.map((acc, index) => (
                <option
                  key={index}
                  value={acc}
                  className="w-full flex items-center justify-center dark:bg-slate-900"
                >
                  {acc}
                </option>
              ))}
            </select>
          </div>

          {selectedAccount !== "Cash" && (
            <Input
              name="custom_account_name"
              label="Account Name"
              placeholder="My Personal Crypto Wallet"
              {...register("custom_account_name", {
                required: "Account Name is required!",
              })}
              error={
                errors.custom_account_name
                  ? errors.custom_account_name.message
                  : ""
              }
              className="inputStyles"
            />
          )}

          {isAccountAlreadyAdded && (
            <div className="flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded">
              <MdOutlineWarning size={30} />
              <span className="text-sm">
                This account has already been activated. Try another one. Thank
                you.
              </span>
            </div>
          )}

          {!isAccountAlreadyAdded && (
            <>
              <Input
                name="account_number"
                label="Account Number"
                placeholder="3864736573648"
                {...register("account_number", {
                  required: "Account Number is required!",
                })}
                error={
                  errors.account_number ? errors.account_number.message : ""
                }
                className="inputStyles"
              />
              <Input
                type="number"
                name="amount"
                label="Initial Amount"
                placeholder="10.56"
                {...register("amount", {
                  required: "Initial amount is required",
                  validate: (val) => {
                    return val > 0 || "Can't add amount less than 0";
                  },
                })}
                error={errors.amount ? errors.amount.message : ""}
                className="inputStyles"
              />
              <Button
                disabled={loading || (selectedAccount !== "Cash" && !customAccountName)}
                type="submit"
                className="bg-violet-700 text-white w-full mt-4 cursor-pointer"
              >
                {loading ? (
                  <BiLoader className="text-2xl animate-spin text-white" />
                ) : (
                  "Create account"
                )}
              </Button>
            </>
          )}
        </form>
      </DialogPanel>
    </DialogWrapper>
  );
};