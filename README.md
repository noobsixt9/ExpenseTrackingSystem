# Expense Tracking System (ETS)

## Overview

ETS is a comprehensive Expense Tracking System designed to help users monitor their financial activities, log income and expenses, manage multiple accounts, and gain insights into their spending and saving habits. It features a user-friendly interface, visual dashboards, and secure authentication.

## Features

-   **Transaction Logging**: Easily log income and expenses with categorized entries.
-   **Visual Dashboards**: Interactive charts and graphs to visualize financial habits and trends.
-   **Multi-Account Support**: Track and manage various financial accounts, including cash, crypto, PayPal, and bank accounts.
-   **AI-Powered Financial Feedback**: Get personalized suggestions and actionable steps to improve spending and saving habits using Google's Gemini AI.
-   **Secure & Private**: Robust authentication and secure handling of financial data.
-   **Data Export**: Download transaction history in CSV or PDF formats.
-   **User Settings**: Customize profile information, currency, and theme settings.
-   **Money Transfer**: Transfer funds between your accounts.

## Technologies Used

### Frontend

-   **React**: A JavaScript library for building user interfaces.
-   **Vite**: A fast build tool for modern web projects.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **Headless UI**: Unstyled, accessible UI components.
-   **Axios**: Promise-based HTTP client for the browser and Node.js.
-   **React Hook Form**: For efficient form management.
-   **React Icons**: Popular icon sets as React components.
-   **React JSON to Excel**: For exporting data to Excel.
-   **React Router DOM**: For declarative routing in React applications.
-   **React Toastify**: For customizable toast notifications.
-   **Recharts**: A composable charting library built with React.
-   **Sonner**: An opinionated toast component for React.
-   **Zustand**: A small, fast, and scalable bear-bones state-management solution.
-   **Firebase**: Used for social authentication (Google).
-   **React Markdown**: For rendering Markdown content.

### Backend

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
-   **PostgreSQL (pg)**: A powerful, open-source object-relational database system.
-   **bcrypt**: For hashing passwords.
-   **jsonwebtoken**: For implementing JSON Web Tokens for authentication.
-   **dotenv**: To load environment variables from a `.env` file.
-   **express-rate-limit**: For basic rate-limiting to prevent abuse.
-   **helmet**: Helps secure Express apps by setting various HTTP headers.
-   **Google Generative AI**: For integrating AI-powered financial feedback.

## Setup and Installation

To get the project up and running on your local machine, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/github-FinalProject.git
cd github-FinalProject
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

**Install Dependencies:**

```bash
npm install
```

**Environment Variables:**

Create a `.env` file in the `backend` directory and add the following:

```
PORT=5001
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret_key"
GEMINI_API_KEY="your_gemini_api_key"
```

*   Replace `your_postgresql_connection_string` with your PostgreSQL database connection URL.
*   Replace `your_jwt_secret_key` with a strong, random string for JWT encryption.
*   Replace `your_gemini_api_key` with your actual Google Gemini API key.

**Database Setup:**

Ensure you have a PostgreSQL database set up. The application will use the tables `tblaccount`, `tbltransaction`, and `tbluser`. You'll need to create these tables based on the application's schema (refer to the backend controllers for schema details).

**Start the Backend Server:**

```bash
npm start
```

The backend server will run on `http://localhost:5001` (or the `PORT` you specified).

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd ../frontend
```

**Install Dependencies:**

```bash
npm install
```

**Start the Frontend Development Server:**

```bash
npm run dev
```

The frontend application will be accessible at `http://localhost:5173` (or the port Vite assigns).

## Usage

1.  **Register/Login**: Create a new account or log in using your credentials or Google authentication.
2.  **Dashboard**: View an overview of your financial activities, including total balance, income, expenses, and recent transactions.
3.  **Accounts**: Manage your different accounts, add new ones, and perform actions like adding money or transferring funds.
4.  **Transactions**: View a detailed history of all your transactions and filter them by date or search terms.
5.  **AI Financial Report**: Click the "Get AI Financial Report" button on the dashboard to receive personalized feedback and suggestions on your spending and saving habits.
6.  **Settings**: Update your profile information, change your password, and customize theme and currency settings.

## API Documentation

Detailed API documentation for the backend can be found here:

[Postman API Documentation](https://documenter.postman.com/preview/44398656-505bf5dd-f826-4d8e-a639-3eaec25b7e2f?environment=&versionTag=latest&apiName=CURRENT&version=latest&documentationLayout=classic-double-column&documentationTheme=dark&logo=https%3A%2F%2Fres.cloudinary.com%2Fpostman%2Fimage%2Fupload%2Ft_team_logo%2Fv1%2Fteam%2Fanonymous_team&logoDark=https%3A%2F%2Fres.cloudinary.com%2Fpostman%2Fimage%2Fupload%2Ft_team_logo%2Fv1%2Fteam%2Fanonymous_team&right-sidebar=303030&top-bar=FFFFFF&highlight=FF6C37&right-sidebar-dark=303030&top-bar-dark=212121&highlight-dark=FF6C37)

## Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit a pull request with your improvements.

## License

This project is licensed under the ISC License.
