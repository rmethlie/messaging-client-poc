import Connection from './connection.js';
export default function connectionMiddleware({ dispatch, getState }) {
  let connectionManager;
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'CONNECT':
          connectionManager = connectionManager || new Connection({dispatch, getState});
          connectionManager.connect(action.data);
          break;
        default: next(action);
      }
    }
  }
}
