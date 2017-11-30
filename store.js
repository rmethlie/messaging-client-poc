import reducers from './reducers.js';
const {
  connection,
  authentication,
  containers,
  containersMiddleware,
  roster,
  rosterMiddleware,
  connectionMiddleware,
  authenticationMiddleware,
  presence,
  conversations,
  conversationsMiddleware,
  editor,
  editorMiddleware,
  ui
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
    conversations,
    editor,
    ui
  });
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose
export const store = createStore(combinedReducers, composeEnhancers(
  applyMiddleware(
    connectionMiddleware,
    authenticationMiddleware,
    rosterMiddleware,
    conversationsMiddleware,
    containersMiddleware,
    editorMiddleware
  )
));

// initialzeAPI(store);

export const ReduxMixin = window.PolymerRedux(store);
