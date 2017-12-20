
export const defaultQuickSelectState = {
  results: {}
}

// actual reducer
export default function quickSelect(state = defaultQuickSelectState, action = {}) {
  switch (action.type) {
    case 'QUICKSELECT.SET': {
      const results = Object.assign({}, state.results, {
        [action.data.id]: action.data.results
      });
      return Object.assign({}, state, defaultQuickSelectState, {results});
    }

    default: return state;
  }
}
