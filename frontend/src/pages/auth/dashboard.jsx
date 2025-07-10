import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/UI/loading";
import api from "../../libs/apiCall";
import Stats from "../../components/UI/stats";
import Info from "../../components/UI/info";
import Chart from "../../components/UI/chart";
import DoughnutChart from "../../components/UI/doughnutChart";
import RecentTransactions from "../../components/UI/recent-transactions";
import Navbar from "../../components/UI/navbar";
import Accounts from "../../components/UI/accounts";
import FinancialFeedback from "../../components/UI/FinancialFeedback";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const fetchDashboardStats = async () => {
    const URL = "/transaction/dashboard";
    try {
      const response = await api.get(URL);
      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something unexpected happened. Try again later."
      );

      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );

  return (
    <>
      <div className="px-0 md:px-5 2xl:px-20">
        <Info title="Dashboard" subTitle="Monitor your financial activities." />
        <div className="flex justify-end">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="bg-violet-700 text-white px-4 py-2 rounded-md cursor-pointer mb-4"
          >
            Get AI Financial Report
          </button>
        </div>
        <Stats
          dt={{
            balance: data?.availableBalance,
            income: data?.totalIncome,
            expense: data?.totalExpense,
          }}
        />
        <div className="flex flex-col-reverse items-center gap-10 w-full md:flex-row">
          <Chart data={data?.chartData} />
          {data?.totalIncome > 0 && (
            <DoughnutChart
              dt={{
                balance: data?.availableBalance,
                income: data?.totalIncome,
                expense: data?.totalExpense,
              }}
            />
          )}
        </div>
        <div className="flex flex-col-reverse gap-0 md:flex-row md:gap-10 2xl:gap-20">
          <RecentTransactions data={data?.lastTransactions} />
          {data?.lastAccount?.length > 0 && (
            <Accounts data={data?.lastAccount} />
          )}
        </div>
      </div>
      <FinancialFeedback
        isOpen={isFeedbackOpen}
        setIsOpen={setIsFeedbackOpen}
      />
    </>
  );
};

export default Dashboard;
