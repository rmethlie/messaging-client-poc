export default function rosterMiddleware({ dispatch, getState }) {
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'API.ROSTER.SET':
          next({
            type: 'ROSTER.SET',
            data: action.data
          });
          break;
        case 'API.ROSTER.CLEAR':
          next({
            type: 'ROSTER.SET',
            data: {}
          });
          break;
        case 'API.ROSTER.ADD':
          next({
            type: 'ROSTER.ADD',
            data: action.data
          });
          break;
        default:
          next(action);
      }
    }
  }
}
