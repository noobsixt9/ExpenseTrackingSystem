import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./title";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

const DoughnutChart = ({ dt }) => {
  const data = [
    { name: "Income", value: Number(dt?.income) || 0 },
    { name: "Expense", value: Number(dt?.expense) || 0 },
  ];

  return (
    <div className="w-full md:w-1/3 flex flex-col items-center bg-gray-50 dark:bg-transparent">
      <Title title="Summary" />
      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={500} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
