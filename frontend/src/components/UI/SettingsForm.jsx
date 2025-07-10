import React, { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
  Transition,
} from "@headlessui/react";
import { BsChevronExpand } from "react-icons/bs";
import { BiCheck, BiLoader } from "react-icons/bi";
import { fetchCountries, fetchCurrencies } from "../../libs";
import useStore from "../../store";
import Input from "./input";
import { toast } from "sonner";
import api from "../../libs/apiCall";
import { Button } from "./button";

export const SettingsForm = () => {
  const { user, theme, setTheme } = useStore((state) => state);

  const toggleTheme = (val) => {
    setTheme(val);
    localStorage.setItem("theme", val);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  });

  const [countriesData, setCountriesData] = useState([]);
  const [countryQuery, setCountryQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [currenciesData, setCurrenciesData] = useState([]);
  const [currencyQuery, setCurrencyQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(
    user?.currency || ""
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLists = async () => {
      try {
        const cList = await fetchCountries();
        const crList = await fetchCurrencies();
        setCountriesData(cList);
        setCurrenciesData(crList);

        if (user?.country) {
          const uc = cList.find((c) => c.country === user.country);
          setSelectedCountry(
            uc || { country: user.country, currency: user.currency }
          );
          setCountryQuery(user.country);
        }

        if (user?.currency) {
          setSelectedCurrency(user.currency);
          setCurrencyQuery(user.currency);
        }
      } catch (e) {
        console.error("Failed to load lists", e);
      }
    };

    loadLists();
  }, [user]);

  useEffect(() => {
    if (selectedCountry?.currency) {
      setSelectedCurrency(selectedCountry.currency);
      setCurrencyQuery(selectedCountry.currency);
    }
  }, [selectedCountry]);

  const filteredCountries =
    countryQuery === ""
      ? countriesData
      : countriesData.filter((c) =>
          c.country
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(countryQuery.toLowerCase().replace(/\s+/g, ""))
        );

  const filteredCurrencies =
    currencyQuery === ""
      ? currenciesData
      : currenciesData.filter((cur) =>
          cur.toLowerCase().includes(currencyQuery.toLowerCase())
        );

  const onSubmit = async (vals) => {
    try {
      setLoading(true);
      const payload = {
        ...vals,
        country: selectedCountry?.country,
        currency: selectedCurrency,
      };

      const { data: res } = await api.put("/user/", payload);

      if (res?.user) {
        const newUser = { ...res.user, token: user.token };
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success(res?.message);
        reset(res.user);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* First and Last Name */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full">
          <Input
            disabled={loading}
            id="firstname"
            label="First Name"
            type="text"
            placeholder={user?.firstname}
            error={errors.firstname?.message}
            {...register("firstname", {
              required: "First name is required.",
            })}
            className="inputStyle"
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            id="lastname"
            label="Last Name"
            type="text"
            placeholder={user?.lastname}
            error={errors.lastname?.message}
            {...register("lastname", {
              required: "Last name is required",
            })}
            className="inputStyle"
          />
        </div>
      </div>

      {/* Email and Contact */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full">
          <Input
            disabled={loading}
            id="email"
            label="Email"
            type="email"
            placeholder={user?.email}
            error={errors.email?.message}
            {...register("email", {
              required: "email is required.",
            })}
            className="inputStyle"
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            id="contact"
            label="Phone"
            type="text"
            placeholder={user?.contact}
            error={errors.contact?.message}
            {...register("contact", {
              required: "Contact is required.",
            })}
            className="inputStyle"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Country Combobox */}
        <div className="w-full">
          <span className="labelStyles">Country</span>
          <Combobox
            value={selectedCountry}
            onChange={setSelectedCountry}
            nullable
          >
            <div className="relative mt-1">
              <div>
                <ComboboxInput
                  className="inputStyles"
                  displayValue={(c) => c?.country || ""}
                  onChange={(e) => setCountryQuery(e.target.value)}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <BsChevronExpand className="text-gray-400" />
                </ComboboxButton>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredCountries.length === 0 && countryQuery !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-500">
                      Nothing found.
                    </div>
                  ) : (
                    filteredCountries.map((country) => (
                      <ComboboxOption
                        key={country.country}
                        value={country}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-violet-600/20 text-white"
                              : "text-gray-900 dark:text-gray-200"
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center gap-2">
                              <img
                                src={country.flag}
                                alt={country.country}
                                className="w-8 h-5 rounded-sm object-cover"
                              />
                              <span
                                className={
                                  selected ? "font-medium" : "font-normal"
                                }
                              >
                                {country.country}
                              </span>
                            </div>
                            {selected && (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}
                              >
                                <BiCheck className="h-5 w-5" />
                              </span>
                            )}
                          </>
                        )}
                      </ComboboxOption>
                    ))
                  )}
                </ComboboxOptions>
              </Transition>
            </div>
          </Combobox>
        </div>

        {/* Currency Combobox */}
        <div className="w-full">
          <span className="labelStyles">Currency</span>
          <Combobox
            value={selectedCurrency}
            onChange={(val) => {
              setSelectedCurrency(val);
              setCurrencyQuery(val);
            }}
            nullable
          >
            <div className="relative mt-1">
              <div>
                <ComboboxInput
                  className="inputStyles"
                  displayValue={(c) => c || ""}
                  onChange={(e) => setCurrencyQuery(e.target.value)}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <BsChevronExpand className="text-gray-400" />
                </ComboboxButton>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredCurrencies.length === 0 && currencyQuery !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-500">
                      Nothing found.
                    </div>
                  ) : (
                    filteredCurrencies.map((cur) => (
                      <ComboboxOption
                        key={cur}
                        value={cur}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-violet-600/20 text-white"
                              : "text-gray-900 dark:text-gray-200"
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={
                                selected ? "font-medium" : "font-normal"
                              }
                            >
                              {cur}
                            </span>
                            {selected && (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}
                              >
                                <BiCheck className="h-5 w-5" />
                              </span>
                            )}
                          </>
                        )}
                      </ComboboxOption>
                    ))
                  )}
                </ComboboxOptions>
              </Transition>
            </div>
          </Combobox>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-10">
        <div className="">
          <p className="text-lg text-black dark:text-gray-400 font-semibold">
            Appearance
          </p>
          <span className="labelStyles">
            Customize how your theme looks on your device.
          </span>
        </div>

        <div className="w-20 md:w-40">
          <select
            className="inputStyles"
            defaultValue={theme}
            onChange={(e) => toggleTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
      <div className="w-full flex items-center justify-between pb-10">
        <div className="">
          <p className="text-lg text-black dark:text-gray-400 font-semibold">
            Appearance
          </p>
          <span className="labelStyles">
            Customize what language you want to use.
          </span>
        </div>

        <div className="w-20 md:w-40">
          <select
            className="inputStyles"
            defaultValue={theme}
            onChange={(e) => toggleTheme(e.target.value)}
          >
            <option value="light">English</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-6 justify-end pb-10 border-b-2 border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          loading={loading}
          type="reset"
          className="px-6 bg-transparent dark:text-black border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="px-8 bg-violet-800 text-white cursor-pointer"
          disabled={loading}
        >
          {loading ? <BiLoader className="animate-spin text-white" /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
