import { v4 as uuidv4 } from "uuid";

export const maskAccountNumber = (accountNumber) => {
  if (typeof accountNumber !== "string" || accountNumber.length < 12) {
    return accountNumber;
  }

  const firstFour = accountNumber.substring(0, 4);
  const lastFour = accountNumber.substring(accountNumber.length - 4);

  const maskedDigits = "*".repeat(accountNumber.length - 8);

  return `${firstFour}${maskedDigits}${lastFour}`;
};

export const formatCurrency = (value) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (isNaN(value)) {
    return "Invalid input";
  }

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: user?.currency || "USD",
    minimumFractionDigits: 2,
  }).format(numberValue);
};

export const getDateSevenDaysAgo = () => {
  const today = new Date();

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  return sevenDaysAgo.toISOString().split("T")[0];
};

export async function fetchCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,currencies"
    );
    const data = await response.json();

    if (response.ok) {
      const countries = data.map((country) => {
        const currencies = country.currencies || {};
        const currencyCode = Object.keys(currencies)[0];

        return {
          country: country.name?.common || "",
          flag: country.flags?.png || "",
          currency: currencyCode || "",
        };
      });

      // Remove duplicates
      const uniqueCountries = Array.from(
        new Map(countries.map((item) => [item.country, item])).values()
      ).filter((c) => c.country); // Ensure country name is not empty

      const sortedCountries = uniqueCountries.sort((a, b) =>
        a.country.localeCompare(b.country)
      );

      return sortedCountries;
    } else {
      console.error(`Error: ${data.message}`);
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return [];
  }
}

export async function fetchCurrencies() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=currencies"
    );
    const data = await response.json();

    if (response.ok) {
      const allCurrencies = data.flatMap((country) =>
        country.currencies ? Object.keys(country.currencies) : []
      );
      const uniqueCurrencies = [...new Set(allCurrencies)];
      return uniqueCurrencies.sort();
    } else {
      console.error(`Error: ${data.message}`);
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return [];
  }
}

export function generateAccountNumber() {
  let accountNumber = "";
  while (accountNumber.length < 13) {
    const uuid = uuidv4().replace(/-/g, "");
    accountNumber += uuid.replace(/\D/g, "");
  }
  return accountNumber.substr(0, 13);
}