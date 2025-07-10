import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/UI/button";
import Title from "../../components/UI/title";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] text-gray-800 dark:from-[#0f0c29] dark:to-[#302b63] dark:text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 relative overflow-hidden">
        <img
          src="/background.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10">
          <Title title="Expense Tracking System" />
          <p className="text-xl md:text-2xl max-w-2xl mt-4 mb-10 text-gray-600 dark:text-gray-300">
            Your finances, under your control. Log expenses, track income,
            manage accounts—all in one place.
          </p>
          <Link to="/sign-up">
            <Button className="px-10 py-4 bg-violet-700 hover:bg-violet-600 text-xl cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Transaction Logging",
              desc: "Log income and expenses with categorized entries.",
            },
            {
              title: "Visual Dashboards",
              desc: "Charts and graphs to understand your financial habits.",
            },
            {
              title: "Multi-Account Support",
              desc: "Track multiple bank accounts, wallets, and cards.",
            },
            {
              title: "Secure & Private",
              desc: "All your financial data is protected and encrypted.",
            },
            {
              title: "Export Data",
              desc: "Download your transaction history in Excel format.",
            },
            {
              title: "AI-Powered Financial Feedback",
              desc: "Get personalized suggestions and actionable steps to improve spending and saving habits using Google's Gemini AI.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-xl shadow-md bg-white dark:bg-[#1e1e2f]"
            >
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">About the System</h2>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          The Expense Tracking System (ETS) is a project built by the students
          of <strong>BCA – Sixth Semester</strong> at <strong>NCIT</strong> as
          part of their minor project. This system is focused on solving real
          financial challenges. Whether you're a student budgeting for the month
          or a small business tracking revenue and costs, ETS provides a clear,
          clean, and powerful interface. With real-time syncing, visual
          insights, and a focus on privacy, managing your money is no longer a
          chore — it's an empowering experience.
        </p>
      </section>

      {/* API Documentation Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Backend API Documentation</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We've documented our backend API using Postman for easy reference. You
          can explore all endpoints, parameters, and sample requests using the
          link below.
        </p>
        <a
          href="https://documenter.postman.com/preview/44398656-505bf5dd-f826-4d8e-a639-3eaec25b7e2f?environment=&versionTag=latest"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg shadow cursor-pointer"
        >
          View API Documentation
        </a>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-gray-100 dark:bg-[#1a1a2e] border-t border-gray-300 dark:border-gray-700">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to get started?
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Join students, professionals, and small businesses already using ETS
          to stay on top of their finances.
        </p>
        <Link to="/sign-up">
          <Button className="px-10 py-4 text-xl bg-violet-700 hover:bg-violet-600 text-white rounded-xl shadow-lg cursor-pointer">
            Join Now
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
