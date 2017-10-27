export default function authenticationMiddleware({ dispatch, getState }) {
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
