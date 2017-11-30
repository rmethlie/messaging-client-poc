const defaultEditorState = {
  jid: null,
  active: false,
  history: null
}

export default function editor(state = defaultEditorState, action = {}) {
  switch (action.type) {
    case 'EDITOR.SET_ACTIVE': {
      const active = action.data;
      console.log('setting editor active to', active);
      return Object.assign({}, state, {active});
      break;
    }

    case 'EDITOR.SET_JID': {
      const jid = action.data;
      console.log('setting editor jid to', jid);
      return Object.assign({}, state, {jid});
      break;
    }

    case 'EDITOR.ADD_HISTORY': {
      const history = action.data;
      console.log('setting editor history to', history);
      return Object.assign({}, state, {history});
      break;
    }

    default:
      return state;
  }
}
