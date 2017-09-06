
const connectionMiddleware = ({ getState }) => {
  let connection;
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'CONNECT':
          connection = connection || Nitro.getConnection({
            appName: 'TRM3',
            appVersion: '0.0.1',
            clientRevision: '12345'
          });
          connection.connect({
            jid: 'russ3.methlie.thomsonreuters.com@reuasmb.net',
            password: 'Welcome1'
          });
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
    case 'STATUS':
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
        case 'AUTHENTICATE_SSO':
          dispatch({
            type: 'CONNECT'
          })
          break;
        default: next(action);
      }
    }
  }
}

const defaultAuthenticationState = {
  type: 'simple',
  status: 'pending'
};
const authentication = (state = defaultAuthenticationState, action = {}) => {
  switch (action.type) {
    case 'SET_AUTH_TYPE':
      return Object.assign({}, state, {
        type: action.authType
      });
    case 'SET_AUTH_STATUS':
      return Object.assign({}, state, {
        status: 'authenticating'
      })
    default: return state;
  }
}
