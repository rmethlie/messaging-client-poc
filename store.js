import reducers from './reducers.js';
const {
  connection,
  authentication,
  containers,
  roster,
  rosterMiddleware,
  connectionMiddleware,
  authenticationMiddleware,
  presence,
  conversations,
  conversationsMiddleware
} = reducers;
const {
  createStore,
  applyMiddleware
} = Redux;
const combinedReducers =
  Redux.combineReducers({
    connection,
    authentication,
    containers,
    roster,
    presence,
    conversations
  });
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose
export const store = createStore(combinedReducers, composeEnhancers(
  applyMiddleware(
    connectionMiddleware,
    authenticationMiddleware,
    rosterMiddleware,
    conversationsMiddleware
  )
));

// initialzeAPI(store);

export const ReduxMixin = window.PolymerRedux(store);
