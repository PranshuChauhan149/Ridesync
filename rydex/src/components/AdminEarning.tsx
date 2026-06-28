"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Star,
  BarChart2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

type Earning = {
  date: string;
  earning: number;
};

function AdminEarning() {
  const [earningData, setEarningData] = useState<Earning[]>([]);

  useEffect(() => {
    const fetchEarning = async () => {
      try {
        const response = await axios.get("/api/admin/earning");
        const chartData = (response.data?.data ?? []) as {
          date: string;
          earning: number;
        }[];

        const normalizedData: Earning[] = chartData.map((item) => ({
          date: item.date,
          earning: Number(item.earning) || 0,
        }));

        const sortedData = normalizedData
          .slice()
          .sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        const last7DaysData = sortedData.slice(-7);

        setEarningData(last7DaysData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEarning();
  }, []);

  const total = earningData.reduce(
    (sum, item) => sum + item.earning,
    0
  );

  const avg = earningData.length
    ? Math.round(total / earningData.length)
    : 0;

  const max = earningData.length
    ? Math.max(...earningData.map((d) => d.earning))
    : 0;

  const bestDay = earningData.find(
    (d) => d.earning === max
  );

  const today = earningData[earningData.length - 1];

  const yesterday = earningData[earningData.length - 2];

  const delta =
    today && yesterday
      ? today.earning - yesterday.earning
      : 0;

  const deltaPositive = delta >= 0;

  const deltaPct =
    yesterday && yesterday.earning
      ? Math.abs(
          Math.round((delta / yesterday.earning) * 100)
        )
      : 0;

  const fmt = (n: number) => "₹" + n.toLocaleString();

  const metrics = [
    {
      label: "Best Day",
      value: fmt(max),
      sub: bestDay
        ? new Date(bestDay.date).toLocaleDateString()
        : "--",
      icon: <Star size={18} />,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Daily Avg",
      value: fmt(avg),
      sub: "Per Day",
      icon: <BarChart2 size={18} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Today",
      value: today ? fmt(today.earning) : "--",
      sub:
        today && yesterday
          ? `${deltaPositive ? "+" : "-"}${fmt(
              Math.abs(delta)
            )} vs yesterday`
          : "--",
      icon: deltaPositive ? (
        <TrendingUp size={18} />
      ) : (
        <TrendingDown size={18} />
      ),
      color: deltaPositive
        ? "text-green-600"
        : "text-red-600",
      bg: deltaPositive
        ? "bg-green-50"
        : "bg-red-50",
    },
    {
      label: "Change",
      value: `${deltaPct}%`,
      sub: "From Yesterday",
      icon: deltaPositive ? (
        <TrendingUp size={18} />
      ) : (
        <TrendingDown size={18} />
      ),
      color: deltaPositive
        ? "text-green-600"
        : "text-red-600",
      bg: deltaPositive
        ? "bg-green-50"
        : "bg-red-50",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 w-full">

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
            Admin Dashboard
          </span>

          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Daily Earnings
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Last 7 days earning report
          </p>
        </div>
      </div>

      {/* Metric Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((item, index) => (
          <div
            key={index}
            className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}
            >
              {item.icon}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              {item.label}
            </p>

            <h3 className="text-2xl font-bold mt-1">
              {item.value}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Daily Earnings */}

      <div className="space-y-3">
        {earningData.length > 0 ? (
          earningData.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border rounded-xl px-4 py-3"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {new Date(item.date).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-500">
                  Daily Revenue
                </p>
              </div>

              <p className="font-bold text-green-600 text-lg">
                {fmt(item.earning)}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No earning data found.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEarning;