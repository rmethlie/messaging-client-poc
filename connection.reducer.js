export const defaultConnectionState = {
  status: 'DISCONNECTED'
};

export default function connection(state = defaultConnectionState, action = {}) {
  switch (action.type) {
    case 'SET_CONNECTION_STATUS':
      return Object.assign({}, state, {
        status: action.data
      });
    default: return state;
  }
}
