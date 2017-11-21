import ApolloClient, {
  createNetworkInterface
} from 'apollo-client';

import { environment } from '../../environments/environment';

const networkInterface = createNetworkInterface({
  uri: environment.baseUrl + '/graphql'
});
networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      if (localStorage.getItem('token')) {
        req.options.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }
      next();
    }
  }
]);

const apolloClient = new ApolloClient({
  networkInterface
});

// export default apolloClient;

export function provideClient(): ApolloClient {
  return apolloClient;
}