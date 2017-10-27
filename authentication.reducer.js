export const defaultAuthenticationState = {
  type: 'unset',
  status: 'PENDING',
  config: {
    sso: {
      url: `/collab-cm/performSSOV2.htm`
    }
  }
};

export default function authentication(state = defaultAuthenticationState, action = {}) {
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
