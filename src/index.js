import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client';
import React from 'react';
import App from './App';
import { setContext } from '@apollo/client/link/context';
import {createRoot} from 'react-dom/client'

import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('SideQuest_HQ_Login_Info');
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  };
});

const httpLink = new HttpLink({
  uri: `http://localhost:4000/`,
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Task: {
        merge: true,
        fields:{
          subtasks:{
            // merging hellhole to get rid of the warning
            merge(existing, incoming, { readField, mergeObjects }) {
              const merged = existing ? existing.slice(0) : [];
              const subtaskIdToIndex = Object.create(null);
              if (existing) {
                existing.forEach((subtask, index) => {
                  subtaskIdToIndex[readField("id", subtask)] = index;
                });
              }
              incoming.forEach(subtask => {
                const id = readField("id", subtask);
                const index = subtaskIdToIndex[id];
                if (typeof index === "number") {
                  // Merge the new subtask data with the existing subtask data.
                  merged[index] = mergeObjects(merged[index], subtask);
                } else {
                  // First time we've seen this subtask in this array.
                  subtaskIdToIndex[id] = merged.length;
                  merged.push(subtask);
                }
              });
              return merged;
            }
          },
          schedule:{
            merge:true
          }
        }
      },
      Tag: {
        merge: true
      },
    }
  }),
  link: splitLink,
});

// temporary fix for websocket link prematurely closing
wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
  wsLink.subscriptionClient.maxConnectTimeGenerator.max;

const root = createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);

