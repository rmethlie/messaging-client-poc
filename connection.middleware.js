import Connection from './connection.js';
export default function connectionMiddleware({ dispatch, getState }) {
  let connectionManager;
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'API.CONNECTION.CONNECT':
          connectionManager = connectionManager || new Connection({dispatch, getState});
          connectionManager.connect(action.data.credentials);
          break;
        default: next(action);
      }
    }
  }
}
