import React from "react";
import useStore from "../../store";
import Title from "../../components/UI/title";
import SettingsForm from "../../components/UI/SettingsForm";
import { ChagePasword } from "../../components/UI/ChangePassword";

const Settings = () => {
  const { user } = useStore((state) => state);

  return (
    <div className="flex flex-col items-center w-full bg-gray-50 dark:bg-black/20 md:px-10 md:my-10 border dark:border-gray-800">
      <div className="w-full max-w-4xl px-4 py-4 my-6 shadow-lg">
        <div className="mt-6 border-b-2 border-gray-200">
          <Title title="General Settings" />
        </div>

        <div className="py-10">
          <p className="text-lg font-bold text-black dark:text-white">
            Profile Information
          </p>

          <div className="flex items-center gap-4 my-8">
            <div className="flex items-center justify-center w-12 h-12 font-bold text-2xl text-white bg-violet-600 rounded-full cursor-pointer">
              {/* <p>{user?.firstname?.charAt(0)}</p> */}
              <p>{user?.firstname?.charAt(0) || "U"}</p>
            </div>
            <p className="text-2xl font-semibold text-black dark:text-gray-400">
              {/* {user?.firstname} */}
              {user?.firstname || "Unknown User"}
            </p>
          </div>
          <SettingsForm />

          {!user?.provided && <ChagePasword />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
