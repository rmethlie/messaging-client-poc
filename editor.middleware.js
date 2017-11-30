export default function editorMiddleware({ dispatch, getState }) {
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'API.EDITOR.SHOW':
          next({
            type: 'EDITOR.SET_JID',
            data: action.data.id
          });
          next({
            type: 'EDITOR.SET_ACTIVE',
            data: true
          });
          break;
        case 'API.EDITOR.HIDE':
          next({
            type: 'EDITOR.SET_ACTIVE',
            data: false
          });
          break;
        default:
          next(action);
      }
    }
  }
}
