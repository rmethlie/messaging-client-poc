

import processTypes from './wizard-processes.js';

export function formatTitle(title = 'The WWWizzarddd') {
  // return passed string or default
  return title;
}

let runningProcess;

export function errorStep(reason = 'No Reason Really') {
  return {
    title: reason,
    choices: [
      {title: 'Start Over', type: 'button'},
      {title: 'Cancel', type: 'button'}
    ],
    open: true
  };
}

export default function wizardMiddleware({ dispatch, getState }) {
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'API.WIZARD.OPEN': {
          // close existing if its open
          if (getState().wizard.open) {
            next({
              type: 'WIZARD.SET',
              data: {open: false}
            });
          }
          const Process = processTypes[action.data.type];
          if (Process) {
            runningProcess = new Process({dispatch, getState});
            const step = runningProcess.nextStep();
            const choices = step.choices;
            const title = step.title;
            const open = true;
            next({
              type: 'WIZARD.SET',
              data: {open, title, choices}
            });
          }
          break;
        }
        case 'API.WIZARD.CLOSE': {
          runningProcess = null;
          next({
            type: 'WIZARD.RESET'
          });
          break;
        }

        case 'API.WIZARD.CHOICE': {
          if (runningProcess) {
            const data = runningProcess.nextStep(action.data);
            next({type: 'WIZARD.SET', data});
          }
          break;
        }

        default:
          next(action);
      }
    }
  }
}
