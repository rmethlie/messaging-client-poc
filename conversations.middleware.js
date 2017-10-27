export default function conversationsMiddleware({ dispatch, getState }) {
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'API.CONVERSATIONS.SET':
          next({
            type: 'CONVERSATIONS.SET',
            data: action.data
          });
          break;
        case 'API.CONVERSATIONS.CLEAR':
          next({
            type: 'CONVERSATIONS.SET',
            data: {}
          });
          break;
        case 'API.CONVERSATIONS.OPEN':
          next({
            type: 'CONVERSATIONS.ADD',
            data: action.data
          });
          const activeContainer = getState().containers.active || 'conversations';
          dispatch({
            type: 'ADD_SLOT',
            data: {
              parent: activeContainer,
              slot: Object.assign({}, action.data)
            }
          });
          break;
        case 'API.CONVERSATIONS.CLOSE':
          next({
            type: 'CONVERSATIONS.REMOVE',
            data: action.data
          });
          break;
        default:
          next(action);
      }
    }
  }
}
