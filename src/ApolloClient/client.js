import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";

/*
The code sample connects to a simple sandbox graphQL endpoint that provides currency exchange rate data.
*/
const httpLink = new HttpLink({
    uri: "https://48p1r2roz4.sse.codesandbox.io"
});

/*
1. link allows you to customize the flow of data from your graphQL queries and mutations to your backend and in-app state management. 
This can include: adding custom headers and routing to REST endpoints and graphQL endpoints.

2. cache allows you to prevent unnecessary networks requests when you already have the data
*/
export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([httpLink])
});