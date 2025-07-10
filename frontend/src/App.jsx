import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AccountPage from "./pages/auth/account-page";
import Dashboard from "./pages/auth/dashboard";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import Transactions from "./pages/auth/transactions";
import Settings from "./pages/auth/settings";
import Navbar from "./components/UI/navbar";
import useStore from "./store";
import { useEffect } from "react";
import { setAuthToken } from "./libs/apiCall";
import SettingsForm from "./components/UI/SettingsForm";
import { Toaster } from "sonner";

import HomePage from "./pages/auth/HomePage";

const RootLayout = () => {
  const { user } = useStore((state) => state);
  setAuthToken(user?.token || "");
  return !user ? (
    <Navigate to="/sign-in" replace={"true"} />
  ) : (
    <>
      <Navbar />
      <div className="min-h-[cal(h-screen-100px)]">
        <Outlet />
      </div>
    </>
  );
};
function App() {
  const { theme, user } = useStore((state) => state);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);
  return (
    <main>
      <div className="w-full min-h-screen px-6 md:px-20">
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accounts" element={<AccountPage />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/"
            element={
              user ? <Navigate to="/overview" replace={true} /> : <HomePage />
            }
          />
        </Routes>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}

export default App;
