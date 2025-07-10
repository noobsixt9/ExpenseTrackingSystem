import { pool } from "../database/database.js";
import { getMonthName } from "../database/hashedPassword.js";

export const getTransactions = async (req, res) => {
  try {
    const today = new Date();
    const _sevenDaysAgo = new Date(today);
    _sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysAgo = _sevenDaysAgo.toISOString().split("T")[0];

    const { df, dt, s } = req.query;
    const { userId } = req.body.user;

    const startDate = new Date(df || sevenDaysAgo);
    const endDate = dt
      ? new Date(new Date(dt).setHours(23, 59, 59, 999))
      : new Date();

    const transactions = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 AND createdat BETWEEN $2 AND $3 AND (description ILIKE '%' || $4 || '%' OR status ILIKE '%' || $4 || '%' OR source ILIKE '%' || $4 || '%') ORDER BY id DESC`,
      values: [userId, startDate, endDate, s || ""],
    });

    res.status(200).json({
      status: "Success",
      message: "Transactions fetched successfully.",
      data: transactions.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

export const getDashboardInformation = async (req, res) => {
  try {
    const { userId } = req.body.user;

    let totalIncome = 0;
    let totalExpense = 0;

    // Aggregate total income and expense grouped by type
    const transactionsResult = await pool.query({
      text: `SELECT type, SUM(amount) AS totalAmount FROM tbltransaction WHERE user_id = $1 GROUP BY type`,
      values: [userId],
    });

    const transactions = transactionsResult.rows;

    transactions.forEach((transaction) => {
      if (transaction.type.toLowerCase() === "income") {
        totalIncome += Number(
          transaction.totalamount || transaction.totalAmount || 0
        );
      } else if (transaction.type.toLowerCase() === "expense") {
        totalExpense += Number(
          transaction.totalamount || transaction.totalAmount || 0
        );
      }
    });

    const availableBalance = totalIncome - totalExpense;

    // Get current year start and end dates
    const year = new Date().getFullYear();
    const start_Date = new Date(year, 0, 1);
    const end_Date = new Date(year, 11, 31, 23, 59, 59);

    // Aggregate monthly sums grouped by month and type
    const result = await pool.query({
      text: `
        SELECT 
          EXTRACT(MONTH FROM createdat) AS month,
          type,
          SUM(amount) AS totalAmount
        FROM tbltransaction
        WHERE user_id = $1 AND createdat BETWEEN $2 AND $3
        GROUP BY EXTRACT(MONTH FROM createdat), type
      `,
      values: [userId, start_Date, end_Date],
    });

    // Prepare chart data for each month
    const data = new Array(12).fill(null).map((_, index) => {
      const monthData = result.rows.filter(
        (item) => Number(item.month) === index + 1
      );

      const income = Number(
        monthData.find((item) => item.type.toLowerCase() === "income")
          ?.totalamount ||
          monthData.find((item) => item.type.toLowerCase() === "income")
            ?.totalAmount ||
          0
      );

      const expense = Number(
        monthData.find((item) => item.type.toLowerCase() === "expense")
          ?.totalamount ||
          monthData.find((item) => item.type.toLowerCase() === "expense")
            ?.totalAmount ||
          0
      );

      return {
        label: getMonthName(index),
        income,
        expense,
      };
    });

    // Fetch last 5 transactions
    const lastTransactionsResult = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 ORDER BY id DESC LIMIT 5`,
      values: [userId],
    });

    // Fetch last 4 accounts
    const lastAccountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1 ORDER BY id DESC LIMIT 4`,
      values: [userId],
    });

    res.status(200).json({
      status: "success",
      availableBalance,
      totalIncome,
      totalExpense,
      chartData: data,
      lastTransactions: lastTransactionsResult.rows,
      lastAccount: lastAccountResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const addTransactions = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { account_id } = req.params;
    const { description, source, amount } = req.body;

    if (!description || !source || !amount) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide all the required fields.",
      });
    }
    // amount validation for 0 and negative amount
    if (Number(amount) <= 0) {
      return res.status(400).json({
        status: "Failed",
        message: " Can't add negative or 0 amount.",
      });
    }

    // check if the account exist or not
    const result = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id=$1`,
      values: [account_id],
    });

    const accountInfo = result.rows[0];

    if (!accountInfo) {
      return res.status(400).json({
        status: "Failed",
        message: "The account doesn't exist.",
      });
    }
    // check the balance available in the account
    if (
      accountInfo.account_balance <= 0 ||
      accountInfo.account_balance < Number(amount)
    ) {
      return res.status(400).json({
        status: "Failed",
        message: "Transaction failed. Insufficient balance on account.",
      });
    }
    // begin transaction
    await pool.query("BEGIN");
    // deducting the amount first from the account
    await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [amount, account_id],
    });

    // updating the transaction table
    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, status, source, amount, type) VALUES($1,$2,$3,$4,$5,$6)`,
      values: [userId, description, "Completed", source, amount, "Expense"],
    });

    await pool.query("COMMIT");
    res.status(200).json({
      status: "Success",
      message: "Transaction completed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
export const transferMoneyToAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { from_account, to_account, amount } = req.body;
    // basic validation
    if (!from_account || !to_account || !amount) {
      return res.status(400).json({
        status: "Failed",
        message: "Please provide all the required fields.",
      });
    }
    // amount checking if 0 or negative
    const newAmount = Number(amount);
    if (newAmount <= 0) {
      return res.status(400).json({
        status: "Failed",
        message: "Can't transfer negative or 0 amount.",
      });
    }
    // check account details and balcne for the from_account
    const fromAccountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [from_account],
    });

    // check if account is available or not and also balance
    const fromAccount = fromAccountResult.rows[0];
    if (!fromAccount) {
      return res.status(400).json({
        status: "Failed",
        message: "Account not found.",
      });
    }
    if (newAmount > fromAccount.account_balance) {
      return res.status(400).json({
        status: "Failed",
        message: "Transfer failed. Insufficient balance on account.",
      });
    }

    await pool.query("BEGIN");
    // deduct in fromaAccount
    await pool.query({
      text: `UPDATE tblaccount SET account_balance= account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount, fromAccount.id],
    });
    // add in toAccount
    const toAccountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [to_account],
    });

    const toAccount = toAccountResult.rows[0];

    if (!toAccount) {
      await pool.query("ROLLBACK"); // Rollback if toAccount not found
      return res.status(400).json({
        status: "Failed",
        message: "Destination account not found.",
      });
    }

    // Now do the update
    await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount, to_account],
    });

    // updating transaction fromAccount as expense
    const description = `Transfer (${fromAccount.account_name} to ${toAccount.account_name})`;

    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, status, source, amount, type) VALUES($1,$2,$3,$4,$5,$6)`,
      values: [
        userId,
        description,
        "Completed",
        fromAccount.account_name,
        newAmount,
        "Expense",
      ],
    });

    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, status, source, amount, type) VALUES($1,$2,$3,$4,$5,$6)`,
      values: [
        userId,
        description,
        "Completed",
        toAccount.account_name,
        newAmount,
        "Income",
      ],
    });

    // commit transaction
    await pool.query("COMMIT");
    res.status(200).json({
      status: "Success",
      message: "Transfer completed successfully.",
    });
  } catch (error) {
    console.error("Error in transferMoneyToAccount:", error);
    await pool.query("ROLLBACK"); // Ensure rollback on any error
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
