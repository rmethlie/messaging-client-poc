
export const defaultUIState = {
  rosterWidth: 250
}

export default function ui(state = defaultUIState, action = {}) {

  switch (action.type) {
    case 'UI.SET.ROSTER_WIDTH': {
      const { rosterWidth } = action.data;
      return Object.assign({}, state, {rosterWidth})
    }

    default:
      return state;
  }
}
