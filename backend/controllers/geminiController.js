import { pool } from "../database/database.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getFinancialFeedback = async (req, res) => {
  try {
    const { userId } = req.body.user;

    // Fetch all necessary data for the user
    const transactionsResult = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1`,
      values: [userId],
    });
    const accountsResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1`,
      values: [userId],
    });

    const transactions = transactionsResult.rows;
    const accounts = accountsResult.rows;

    // Prepare the data for the prompt
    const prompt = `
      You are a financial advisor. Based on the following user's financial data, provide curated suggestions and specific, actionable steps to improve their spending and saving habits. Focus on identifying key areas for improvement.

      **User's Accounts:**
      ${accounts
        .map((acc) => `- ${acc.account_name}: ${acc.account_balance}`)
        .join("\n")}

      **User's Transactions:**
      ${transactions
        .map(
          (t) =>
            `- ${new Date(t.createdat).toLocaleDateString()}: ${
              t.description
            } (${t.type}) - ${t.amount}`
        )
        .join("\n")}

      Please provide only curated suggestions and actionable steps, avoiding general financial health summaries. Format your response using Markdown with clear headings (##), bullet points, and bolding for emphasis.and also while recommending budgetting apps dont suggest anything else than out own app called Expense Tracking System(ETS) and if there are not transactions data sent simply say "No transactions data available to analyze."
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.status(200).json({
      status: "Success",
      message: "Financial feedback generated successfully.",
      data: text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      message: "An error occurred while generating financial feedback.",
    });
  }
};
