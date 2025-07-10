import React, { useState } from "react";
import { MdOutlineClose, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiCurrencyFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { IoIosMenu } from "react-icons/io";
import useStore from "../../store";
import ThemeSwitch from "./ThemeSwitch";
import { auth } from "../../libs/firebaseConfig";
import TransitionWrapper from "./wrappers/transition";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";

const links = [
  { label: "Dashboard", link: "/overview" },
  { label: "Transactions", link: "/transactions" },
  { label: "Accounts", link: "/accounts" },
  { label: "Settings", link: "/settings" },
];

const UserMenu = () => {
  const { user, setCredentials } = useStore((state) => state);
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      setCredentials(null);
      navigate("/");
    } catch (error) {
      console.error("Error signing out from Firebase:", error);
    }
  };

  return (
    <Menu as="div" className="relative z-50">
      <div>
        <MenuButton className="focus:outline-none cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-10 2xl:w-12 h-10 2xl:h-12 rounded-full text-white bg-violet-600 cursor-pointer flex items-center justify-center">
              <p className="text-2xl font-bold">{user?.firstname?.charAt(0)}</p>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-lg font-medium text-black dark:text-gray-400">
                {user?.firstname}
              </p>
              <span className="text-sm text-gray-700 dark:text-gray-500">
                {user?.email}
              </span>
            </div>
            <MdOutlineKeyboardArrowDown className="hidden md:block text-2xl text-gray-600 dark:text-gray-300 cursor-pointer" />
          </div>
        </MenuButton>
      </div>
      <TransitionWrapper>
        <MenuItems className="absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleSignout}
                  className={`${
                    active
                      ? "bg-violet-500/10 text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-gray-500"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-pointer`}
                >
                  Sign Out
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </TransitionWrapper>
    </Menu>
  );
};

const MobileSidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useStore((state) => state);

  return (
    <div>
      <Popover>
        {({ open }) => (
          <>
            <PopoverButton className="flex md:hidden items-center rounded-md font-medium focus:outline-none text-gray-600 dark:text-gray-400">
              {open ? <MdOutlineClose size={26} /> : <IoIosMenu size={26} />}
            </PopoverButton>
            <TransitionWrapper>
              <PopoverPanel className="absolute left-1/2 z-50 bg-white dark:bg-slate-800 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 py-6 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-2">
                  {links.map(({ label, link }, index) => (
                    <Link to={link} key={index}>
                      <button
                        className={`${
                          link === path
                            ? "bg-black dark:bg-slate-900 text-white"
                            : "text-gray-700 dark:text-gray-500"
                        } w-full px-6 py-2 rounded-full text-left`}
                      >
                        {label}
                      </button>
                    </Link>
                  ))}

                  <div className="flex items-center justify-between py-6 px-4">
                    <ThemeSwitch />
                    {user ? (
                      <UserMenu />
                    ) : (
                      <div className="flex gap-4">
                        <Link to="/sign-in">
                          <button className="px-4 py-2 rounded-full bg-violet-600 text-white">
                            Sign In
                          </button>
                        </Link>
                        <Link to="/sign-up">
                          <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-black dark:text-white">
                            Sign Up
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </PopoverPanel>
            </TransitionWrapper>
          </>
        )}
      </Popover>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useStore((state) => state);

  return (
    <div className="w-full flex items-center justify-between py-6 px-4 md:px-10">
      <Link to="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 md:w-12 h-10 md:h-12"
          />
          <span className="text-xl font-bold text-black dark:text-white">
            Expense Tracking System
          </span>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        {links.map(({ label, link }, index) => (
          <div
            key={index}
            className={`${
              link === path
                ? "bg-black dark:bg-slate-800 text-white"
                : "text-gray-700 dark:text-gray-500"
            } px-6 py-2 rounded-full`}
          >
            <Link to={link}>{label}</Link>
          </div>
        ))}
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-10 2xl:gap-20">
        <ThemeSwitch />
        {user ? (
          <UserMenu />
        ) : (
          <div className="flex gap-4">
            <Link to="/sign-in">
              <button className="px-4 py-2 rounded-full bg-violet-600 text-white">
                Sign In
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-black dark:text-white">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="flex md:hidden">
        <MobileSidebar />
      </div>
    </div>
  );
};

export default Navbar;
