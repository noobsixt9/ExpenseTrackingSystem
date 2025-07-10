import React, { useEffect, useState } from "react";
import useStore from "../../store";
import { FaBtc, FaPaypal, FaUniversity } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { RiVisaLine } from "react-icons/ri";
import Loading from "../../components/UI/loading";
import { MdAdd, MdVerifiedUser } from "react-icons/md";
import Title from "../../components/UI/title";
import { toast } from "react-toastify";
import api from "../../libs/apiCall";
import AccountMenu from "../../components/UI/account-dialog";
import { formatCurrency, maskAccountNumber } from "../../libs";
import { AddAccount } from "../../components/UI/add-account";
import AddMoney from "../../components/UI/add-money-account";
import TransferMoney from "../../components/UI/transfer-money";

const ICONS = {
  crypto: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <FaBtc size={26} />
    </div>
  ),
  "visa debit card": (
    <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
      <RiVisaLine size={26} />
    </div>
  ),
  cash: (
    <div className="w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full">
      <GiCash size={26} />
    </div>
  ),
  paypal: (
    <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
      <FaPaypal size={26} />
    </div>
  ),
  bank: (
    <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
      <FaUniversity size={26} />
    </div>
  ),
};

const AccountPage = () => {
  const { user, setCredentials } = useStore((state) => state);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTopup, setIsOpenTopup] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const { data: res } = await api.get(`/account`);
      setData(res?.data);
      const accounts = res?.data.map((account) => account.account_name);
      const updatedUser = { ...user, accounts };
      setCredentials(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddMoney = (el) => {
    setSelectedAccount(el?.id);
    setIsOpenTopup(true);
  };
  const handleTransferMoney = (el) => {
    setSelectedAccount(el?.id);
    setIsOpenTransfer(true);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAccounts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full py-10">
        <div className="flex items-center justify-between">
          <Title title="Accounts Information" />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="py-1.5 px-2 rounded bg-black justify-center gap-2 border dark:bg-violet-600 text-white dark:text-white flex items-center border-gray-500 cursor-pointer"
            >
              <MdAdd size={22} />
              <span className="">Add</span>
            </button>
          </div>
        </div>

        {data?.length === 0 ? (
          <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg">
            <span>No Account Found</span>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 gap-6">
            {data?.map((acc, index) => (
              <div
                key={index}
                className="w-full h-48 flex flex-col bg-gray-50 dark:bg-slate-800 p-4 rounded shadow overflow-hidden justify-between"
              >
                <div className="flex items-start justify-between">
                  {(() => {
                    const [accountType, displayName] =
                      acc?.account_name?.includes(":")
                        ? acc.account_name.split(":")
                        : [acc.account_name, acc.account_name];
                    return (
                      ICONS[accountType?.toLowerCase()] || (
                        <div className="w-12 h-12 bg-gray-400 text-white flex items-center justify-center rounded-full">
                          ?
                        </div>
                      )
                    );
                  })()}
                  <AccountMenu
                    addMoney={() => handleOpenAddMoney(acc)}
                    transferMoney={() => handleTransferMoney(acc)}
                  />
                </div>

                <div className="space-y-1 mt-2">
                  <div className="flex items-center">
                    <p className="text-black dark:text-white text-xl font-bold">
                      {acc?.account_name?.includes(":")
                        ? acc.account_name.split(":")[1]
                        : acc.account_name}
                    </p>
                    <MdVerifiedUser
                      size={20}
                      className="text-emerald-600 ml-1"
                    />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {maskAccountNumber(acc?.account_number)}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(acc?.createdat).toLocaleDateString("en-US")}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg text-gray-700 dark:text-gray-300 font-semibold">
                    {formatCurrency(acc?.account_balance)}
                  </p>
                  {/* <button
                    onClick={() => handleOpenAddMoney(acc)}
                    className="text-sm text-violet-600 hover:underline"
                  >
                    Add Money
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddAccount
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchAccounts}
        key={new Date().getTime()}
      />

      <AddMoney
        isOpen={isOpenTopup}
        setIsOpen={setIsOpenTopup}
        id={selectedAccount}
        refetch={fetchAccounts}
        key={new Date().getTime() + 1}
      />

      <TransferMoney
        isOpen={isOpenTransfer}
        setIsOpen={setIsOpenTransfer}
        id={selectedAccount}
        refetch={fetchAccounts}
        key={new Date().getTime() + 2}
      />
    </>
  );
};

export default AccountPage;
