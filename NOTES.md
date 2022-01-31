## How to Set Up GraphQL in a React App via Pluralsight

- INTRODUCTION:
    - GraphQL is a query language for querying exactly what you want from many resources in a single request. 
    - It is intended for clients such as web apps to be more performant and to make it easier to work with backend data.
    - This guide will demonstrate how to integrate GraphQL into your React app using Apollo Client. 
    - You will use configure Apollo Client and then the *useQuery* to retrieve data from graphQL and REST endpoints. 
    - This guide assumes a basic understanding of React Hooks.

- START A NEW REACT PROJECT:
    - Start by creating a new React project by running the following commands:
    ```javascript
        npx create-react-app my-graphql-react-project
        cd my-graphql-react-project
        yarn add @apollo/client graphql
    ```
    - These commands set up a new React project and install @apollo/client, which is a stable and mature graphQL library. 
    - Apollo helps with state management and in-memory caching in your app. 
    - This allows you to achieve more with less code compared to a React Redux project.

- SET UP APOLLO CLIENT:
    - To start using ApolloClient to query a graphQL endpoint in your React app, you must set up a client and make it available to relevant components.
    - Create the file src/ApolloClient/client.js and insert the following code.
    ```javascript
        import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
        import { RestLink } from "apollo-link-rest";
        const httpLink = new HttpLink({
            uri: "https://48p1r2roz4.sse.codesandbox.io",
        });
        export const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: ApolloLink.from([httpLink]),
        });
    ```
    - Two pieces of configuration are required:
        1. link allows you to customize the flow of data from your graphQL queries and mutations to your backend and in-app state management. 
            - This can include: adding custom headers and routing to REST endpoints and graphQL endpoints.
        2. cache allows you to prevent unnecessary networks requests when you already have the data.
    - The code sample above connects to a simple sandbox graphQL endpoint that provides currency exchange rate data.

- MAKE APOLLOCLIENT AVAILABLE TO THE REST OF YOUR APP:
    - With the client configuration, you can use React's Context API so that your child components can access your configuration and make queries and mutations. 
    - To do this, update your src/App.js to the following:
    ```javascript
        import React from "react";
        import "./App.css";
        import { client } from "./ApolloClient/client";
        import { ApolloProvider } from '@apollo/client';
        import ExchangeRatesPage from './ExchangeRatesPage';
        function App() {
            return (
                <ApolloProvider client={client}>
                <div className="App">
                    <ExchangeRatesPage />
                </div>
                </ApolloProvider>
            );
        }
        export default App;
    ```
    - You have imported the client you created earlier and wrapped everything with the ApolloProvider component. 
    - These changes are necessary so that the ExchangeRatesPage component that you will create in the next section knows how to fetch data.

- MAKE A GRAPHQL QUERY FROM A COMPONENT:
    - With the ApolloClient in context, child components of App.js can use the useQuery and useLazyQuery hooks to query data.
    - This section describes how to use the useQuery hook. Create the file src/ExchangeRatePage.js
    ```javascript
        import React from "react";
        import { useQuery, gql } from "@apollo/client";

        const EXCHANGE_RATES = gql`
        query GetExchangeRates {
            rates(currency: "AUD") {
            currency
            rate
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
        return data.rates.map(({ currency, rate }) => (
                <div key={currency}>
                <p>
                    {currency}: {rate}
                </p>
                </div>
            ));
        }
        export default ExchangeRatePage;
    ```
    - When this component is loaded, it immediately makes the query to the server, and the loading property is set to true. 
    - Once the data is returned, your component is immediately rerendered and the data property is populated. 
    - You should notice that there is much less boilerplate to get started querying data. Loading and error states properties are handled for you. 
    - If you would like more control over loading, you can use the *useLazyQuery* hook and call the return function when you want to trigger the fetch operation.

- USE GRAPHQL TO QUERY REST RESOURCES:
    - If you have a set of REST endpoints, you can still use Apollo and GraphQL to query this data. 
    - To do this, you need to install apollo-rest-link. Run the following commands to install the required packages.
    ```javascript
        yarn add graphql-anywhere apollo-link-rest
    ```
    - Then update your src/ApolloClient/client.js file to the following:
    ```javascript
        import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
        import { RestLink } from "apollo-link-rest";
        import { HttpLink } from "apollo-link-http";
        const restLink = new RestLink({
        endpoints: {
                openExchangeRate: "https://open.exchangerate-api.com/v6/",
            },
        });
        const httpLink = new HttpLink({
            uri: "https://48p1r2roz4.sse.codesandbox.io",
        });
        export const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: ApolloLink.from([restLink, httpLink]),
        });
    ```
    - You've now configured two ApolloLinks:
        1. HttpLink handles requests to your graphQL endpoint
        2. RestLink handles requests to one or more REST endpoints
    - To activate your RestLink, you can use the @rest graphQL directive. Update your EXCHANAGE_RATES query to the following:
    ```javascript
        const EXCHANGE_RATES = gql`
        query GetExchangeRates {
                rates(currency: "AUD") {
                currency
                rate
            }
                openExchangeRates @rest(type: "openExchangeRates", path: "/latest", endpoint: "openExchangeRate") {
                rates
                }
            }
        `;
    ```
    - Apollo Client will make a request to your REST endpoint with your graphQL endpoint. 
    - The URI to your rest endpoint will be constructed by combining the path specified in the @rest directive and endpoint configured in the client.js. 
    - In this case, the URI would be resolved to https://open.exchangerate-api.com/v6/latest. 
    - The results of your REST request will be appended to the data property returned from the useQuery hook. 
    - If your request is successful, the structure of the data property will look like this:
    ```json
        {
        "rates": [ { "currency": "AED", "rate": "2.67777" } ],
        "openExchangeRate": {
                "rates": { "ARS": 75.17 }
            }
        }
    ```
    - At the root, the rates from the graphQL endpoint are unioned with the openExchangeRate property from the REST endpoint.
    - From a client perspective, this is convenient since you can benefit from Apollo's caching and state management without completely rewriting your backend to GraphQL.

- CONCLUSION:
    - Interacting with remote data is a large component of modern web apps. Using Apollo and GraphQL, querying data from REST and GraphQL endpoints becomes much easier. 
    - As a next step, you may want to explore other Apollo features such as mutations and subscription.