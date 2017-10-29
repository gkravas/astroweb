/**
 * Created by Tobia on 12/04/17.
 */
import { Config } from '../config.module';
import ApolloClient, {
  createNetworkInterface
} from 'apollo-client';

const networkInterface = createNetworkInterface({
  uri: new Config().BASE_URL + '/graphql'
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