import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BiTransfer } from "react-icons/bi";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { MdMoreVert } from "react-icons/md";
import TransitionWrapper from "./wrappers/transition";

export default function AccountMenu({ addMoney, transferMoney }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-600 cursor-pointer">
        <MdMoreVert 
        className="text-2xl text-gray-400"/>
      </MenuButton>

      <TransitionWrapper>
        <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 space-y-2">
            <MenuItem>
              {({}) => (
                <button
                  onClick={transferMoney}
                  className={`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 cursor-pointer`}
                >
                  <BiTransfer />
                  Transfer Funds
                </button>
              )}
            </MenuItem>

            <MenuItem>
              {({}) => (
                <button
                  onClick={addMoney}
                  className={`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 cursor-pointer`}
                >
                  <FaMoneyCheckDollar />
                  Add Money
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </TransitionWrapper>
    </Menu>
  );
}
