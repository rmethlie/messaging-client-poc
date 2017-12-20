export const defaultWizardState = {
  open: false,
  title: 'The WWWizarddd',
  choices: []
}

// actual reducer
export default function wizard(state = defaultWizardState, action = {}) {
  switch (action.type) {
    case 'WIZARD.SET':
      return Object.assign({}, state, action.data);
    case 'WIZARD.RESET':
      return Object.assign({}, defaultWizardState);
    default:
      return state;
  }
}
