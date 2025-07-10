import { useEffect, useState } from "react";
import api from "../../libs/apiCall";
import { toast } from "sonner";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import Loading from "./loading";
import { formatCurrency } from "../../libs";
import Input from "./input";
import { Button } from "./button";
import { MdOutlineWarning } from "react-icons/md";
import useStore from "../../store";
import { useForm } from "react-hook-form"; // ✅ Import added

const AddTransactions = ({ isOpen, setIsOpen, refetch }) => {
  const { user } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch, // ✅ Correctly destructured from useForm
  } = useForm();

  const [accountBalance, setAccountBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [accountInfo, setAccountInfo] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(""); // ✅ Track selected value

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const newData = { ...data, source: accountInfo.account_name };
      const { data: res } = await api.post(
        `/transaction/add-transaction/${accountInfo.id}`,
        newData // ✅ Make sure data is passed
      );
      if (res?.status === "Success") {
        toast.success(res?.message || "");
        setIsOpen(false);
        refetch();
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
      toast.error(error?.response?.data?.message || error.message); // ✅ Fixed typo
    } finally {
      setLoading(false);
    }
  };

  const getAccountBalance = (val) => {
    const filteredAccount = accountData?.find(
      (account) => account.account_name === val
    );
    setAccountBalance(filteredAccount ? filteredAccount.account_balance : 0);
    setAccountInfo(filteredAccount);
    setSelectedAccount(val); // ✅ Set selected value
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const { data: res } = await api.get(`/account`);
      setAccountData(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left">
        <DialogTitle
          as="h3"
          className="text-l font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
        >
          Add Transaction
        </DialogTitle>

        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col gap-1 mb-2">
              <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                Select Account
              </p>
              <select
                value={selectedAccount}
                onChange={(e) => getAccountBalance(e.target.value)}
                className="inputStyles"
              >
                <option value="" disabled>
                  Select Account
                </option>
                {accountData?.map((acc, index) => (
                  <option
                    key={index}
                    value={acc.account_name}
                    className="dark:bg-slate-900"
                  >
                    {acc.account_name} -{" "}
                    {formatCurrency(
                      acc.account_balance,
                      user?.country?.currency
                    )}
                  </option>
                ))}
              </select>
            </div>

            {accountBalance <= 0 && selectedAccount && (
              <div className="flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded">
                <MdOutlineWarning size={30} />
                <span className="text-sm">
                  You cannot make a transaction from this account. Insufficient
                  balance.
                </span>
              </div>
            )}

            {accountBalance > 0 && (
              <>
                <Input
                  name="description"
                  label="Description"
                  placeholder="Grocery Store"
                  {...register("description", {
                    required: "Transaction description is required.",
                  })}
                  error={errors?.description?.message}
                  className="inputStyle"
                />
                <Input
                  type="number"
                  name="amount"
                  label="Amount"
                  placeholder="100.00"
                  {...register("amount", {
                    required: "Transaction amount is required.",
                  })}
                  className="inputStyle"
                />
                <div className="w-full mt-8">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="bg-violet-700 text-white w-full"
                  >
                    {`Confirm ${
                      watch("amount")
                        ? formatCurrency(
                            watch("amount"),
                            user?.country?.currency
                          )
                        : ""
                    }`}
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </DialogPanel>
    </DialogWrapper>
  );
};

export default AddTransactions;
