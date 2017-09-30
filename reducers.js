'use strict';

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

const defaultContainerState = {
  id: 'root',
  children: [],
  layout: {
    direction: 'column'
  }
}
const defaultContainersState = {
  byId: {
    'root': Object.assign({}, defaultContainerState, {
      title: 'Root Container',
      layout: {
        flow: 'row'
      }
    })
  },
}

const generateContainerId =
  () => `${Math.floor(Math.random() * (1000000 - 1) + 1)}`;

function addContainer(state, action) {
  const container = Object.assign({}, {
    id: generateContainerId(),
    children: [],
    layout: {
      flow: 'column'
    }
  }, action.data);
  // should we add to some other child or the root?
  const parentId = action.data.parent || 'root';
  // cant be your own child
  if (container.id === parentId) {
    return state;
  }
  // cant have parent as one of your own children
  if (container.children.indexOf(parentId) > -1) {
    return state;
  }
  // go get the parent
  const parent = state.byId[parentId];
  // if there is a parent, and container is not already a child
  if (parent && parent.children.indexOf(parentId) === -1) {
    // add the container as a new child
    parent.children = [...parent.children, container.id];
  }
  // add container to the flat index
  state.byId = Object.assign({}, state.byId, {
    [container.id]: container
  });
  // return the new containers object
  return state;
}


function removeContainer(state, action) {
  const containerId = action.data.id;
  let containers = Object.assign({}, state.containers);
  delete containers.containerId;
  return Object.assign({}, state, containers);
}

function setLayout(state, action) {
  const container = state.byId[action.data.id];
  if (container) {
    const updatedContainer = Object.assign({}, container);
    updatedContainer.layout =
      Object.assign({}, updatedContainer.layout, action.data);
    return Object.assign({}, state, {
      byId: Object.assign({}, state.byId, {[updatedContainer.id]: updatedContainer})
    });
  }
  return state;
}

const containers = (state = defaultContainersState, action = {}) => {
  switch (action.type) {
    case 'ADD_CONTAINER':
      return addContainer(state, action);
    case 'REMOVE_CONTAINER':
      return removeContainer(state, action);
    case 'SET_LAYOUT':
      return setLayout(state, action);
    default:
      return state;
  }
}
