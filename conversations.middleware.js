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
          const parent = action.data.id || activeContainer;
          const id = action.data.jid;
          const slot = Object.assign({}, {id});
          dispatch({
            type: 'ADD_SLOT',
            data: {parent, slot}
          });
          dispatch({
            type: 'SET_ACTIVE',
            data: {id: parent}
          })
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
