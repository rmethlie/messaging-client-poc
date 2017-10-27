const defaultPresenceState = {};

export default function presence(state = defaultPresenceState, action = {}) {
  switch (action.type) {
    case 'PRESENCE.SET':
      return Object.assign({}, state, {
        [action.data.jid]: action.data
      });

    default:
      return state;
  }
}
