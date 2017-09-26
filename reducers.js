const STATUS_LABELS = [
  'INITIAL',
  'CONNECTING',
  'CONFAIL',
  'AUTHENTICATING',
  'AUTHFAIL',
  'CONNECTED',
  'DISCONNECTED',
  'DISCONNECTING',
  'FATAL_FAILURE',
  'REDIRECT',
  'CONNTIMEOUT'
];

const connectionMiddleware = ({ getState }) => {
  let connection;
  return (next) => {
    function onConnectionStatus({ status }) {
      next({
        type: 'SET_CONNECTION_STATUS',
        data: STATUS_LABELS[status]
      });
      // TODO: Not here...
      if (status === 5) {
        next({
          type: 'SET_AUTH_STATUS',
          data: 'AUTHENTICATED'
        });
      }
    }
    function normalizeCredentials(creds) {
      // TODO: normalize jid
      return creds;
    }
    return (action) => {
      switch (action.type) {
        case 'CONNECT':
          connection = connection || Nitro.getConnection({
            appName: 'TRM3',
            appVersion: '0.0.1',
            clientRevision: '12345'
          });
          connection.connect(
            Object.assign(normalizeCredentials(action.data), {
              callback: onConnectionStatus
            })
          );
          break;
        default: next(action);
      }
    }
  }
}

const defaultConnectionState = {
  status: 'disconnected'
};

const connection = (state = defaultConnectionState, action = {}) => {
  switch (action.type) {
    case 'SET_CONNECTION_STATUS':
      return Object.assign({}, state, {
        status: action.data
      });
    default: return state;
  }
}

const authenticationMiddleware = ({ dispatch, getState }) => {
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'AUTHENTICATE_SIMPLE':
          dispatch({
            type: 'CONNECT',
            data: action.data
          });
          break;
        case 'AUTHENTICATE_SSO': {
          next({
            type: 'SET_AUTH_STATUS',
            data: 'AUTHENTICATING'
          });
          dispatch({
            type: 'CONNECT',
            data: action.data
          });
          break;
        }
        default: next(action);
      }
    }
  }
}

const defaultAuthenticationState = {
  type: 'unset',
  status: 'pending',
  config: {
    sso: {
      url: `/collab-cm/performSSOV2.htm`
    }
  }
};

const authentication = (state = defaultAuthenticationState, action = {}) => {
  switch (action.type) {
    case 'SET_AUTH_TYPE':
      return Object.assign({}, state, {
        type: action.authType
      });
    case 'SET_AUTH_STATUS':
      return Object.assign({}, state, {
        status: action.data
      })
    default: return state;
  }
}

const containerTree = new TreeModel();
const defaultContainerState = {
  _id: '0',
  title: 'Untitled Container'
}
const defaultContainersState = Object.assign({}, defaultContainerState, {
  title: 'Root Container'
});
console.log('defaultContainersState', defaultContainersState);
const containersRoot = containerTree.parse(defaultContainersState);

function createContainer(config) {
  return containerTree.parse({
    _id: config.id,
    title: config.title
  });
}

function addContainer(state, action) {
  const containerNode = createContainer(action.data);
  // should we add to some other child or the root?
  const parent = action.data.parent ?
    containersRoot.first((node) => {
      return node.model._id === action.data.parent
    }) :
    containersRoot;
  // add new child to parent
  parent.addChild(containerNode);
  // return the new containers object
  return containersRoot;
}

function removeContainer(state, action) {
  const containerId = action.data.id;
  let containers = Object.assign({}, state.containers);
  delete containers.containerId;
  return Object.assign({}, state, containers);
}

const containers = (state = containersRoot, action = {}) => {
  switch (action.type) {
    case 'ADD_CONTAINER':
      return addContainer(state, action);
      break;
    case 'REMOVE_CONTAINER':
      return removeContainer(state, action);
      break;
    default:
      return state;
  }
}
