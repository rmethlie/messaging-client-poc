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
  ui,
  quickSelect,
  quickSelectMiddleware,
  wizard,
  wizardMiddleware
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
    ui,
    quickSelect,
    wizard
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
    editorMiddleware,
    quickSelectMiddleware,
    wizardMiddleware
  )
));

// initialzeAPI(store);

export const ReduxMixin = PolymerRedux(store);
