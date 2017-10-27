const defaultConversationsState = {
  count: 0,
  byId: {},
  all: []
}

const defaultConversationState = {
  jid: '',
  active: false
}

function hydrateConversations(conversations) {
  return conversations;
}

export default function conversations(state = defaultConversationsState, action = {}) {
  switch (action.type) {
    case 'CONVERSATIONS.RESTORE': {
      const conversations = hydrateConversations(action.data);
      return Object.assign({}, state, conversations);
      break;
    }

    case 'CONVERSATIONS.SET': {
      const conversations = action.data;
      return Object.assign({}, state, conversations);
      break;
    }

    case 'CONVERSATIONS.ADD': {
      const conversation = action.data;
      const byId = Object.assign({}, state.byId, {
        [conversation.jid]: conversation
      });
      const all = [...state.all, conversation];
      const count = all.length;
      return Object.assign({}, state, {count, byId, all});
    }

    default:
      return state;
  }
}
