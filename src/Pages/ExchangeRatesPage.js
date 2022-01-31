import React from "react";
import { useQuery, gql } from "@apollo/client";

const EXCHANGE_RATES_AND = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
      name
    }
    openExchangeRates @rest(type: "openExchangeRates", path: "/latest", endpoint: "openExchangeRate") {
      rates
    }
  }
`;

const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
      name
    }
  }
`;

function ExchangeRatePage() {
  const { data, loading, error } = useQuery(EXCHANGE_RATES);

  if (loading) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  console.log(data);

  return data.rates.map(({ currency, rate, name }) => (
    <div key={currency}>
      <p>
        <span>{currency}: {rate}</span>
        <br />
        <span>{name}</span>
      </p>
    </div>
  ));
}

export default ExchangeRatePage;