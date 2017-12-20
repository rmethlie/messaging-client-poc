export function formatTitle(title = 'The WWWizzarddd') {
  // return passed string or default
  return title;
}

export function addRosterItemProcess() {

  const initialChoices = [{
      id: 'STEP_1_CHOICE_CONTACT',
      title: 'Contact',
      type: 'button'
    }, {
      id: 'STEP_1_CHOICE_CHATROOM',
      title: 'Chatroom',
      type: 'button'
    }, {
      id: 'STEP_1_CHOICE_GROUP',
      title: 'Group',
      type: 'button'
    }, {
      id: 'STEP_1_CHOICE_SMART_GROUP',
      title: 'Smart Group',
      type: 'button'
  }];

  const _initialStep = {
    title: 'What type of contact?',
    choices: initialChoices,
    open: true
  };

  function step3() {
    return {
      title: '',
      choices: [],
      open: false
    }
  }

  function step2(itemType) {
    this.nextStep = step3.bind(this);
    return {
      title: `Added contact '${itemType.value}'`,
      choices: [{
        id: 'finished',
        title: 'Finished',
        type: 'button'
      }, {
        id: 'restart',
        title: 'Add Another',
        type: 'button'
      }],
      open: true
    };
  }

  function step1(choice) {
    const typeChoice = initialChoices[choice.id];
    if (typeChoice) {
      switch (typeChoice.id) {
        case 'STEP_1_CHOICE_CONTACT' :
          this.nextStep = step2.bind(this);
          return {
            title: 'Enter Email',
            choices: [{
              id: 'STEP_2_ENTER_EMAIL',
              title: 'Email',
              type: 'email'
            }],
            open: true
          }
        break;

        case 'STEP_1_CHOICE_CHATROOM' :
          this.nextStep = function(choice) {
            return {
              title: 'Done adding Chatroom!',
              choices: [{
                id: 'finished',
                title: 'finished',
                type: 'button'
              }, {
                id: 'restart',
                title: 'add another',
                type: 'button'
              }],
              open: true
            };
          }

          return {
            title: 'Enter Chatroom ID',
            choices: [{
              type: 'email'
            }],
            open: true
          }
        break;

        case 'STEP_1_CHOICE_GROUP' :
          this.nextStep = function(choice) {
            return {
              title: 'Done adding group!',
              choices: [{
                id: 'finished',
                title: 'finished',
                type: 'button'
              }, {
                id: 'restart',
                title: 'add another',
                type: 'button'
              }],
              open: true
            };
          }

          return {
            title: 'Enter Group Name',
            choices: [{
              id: 'STEP_2_ENTER_GROUP_NAME',
              title: 'Group Name',
              type: 'text'
            }],
            open: true
          }
        break;

        case 'STEP_1_CHOICE_SMART_GROUP' :
          this.nextStep = function(groupName) {
            console.log('step 2 group name is', groupName);
            this.nextStep = function(filter) {
              console.log('filter', filter);
              return {
                title: 'Done adding smart group!',
                choices: [{
                  id: 'finished',
                  title: 'finished',
                  type: 'button'
                }, {
                  id: 'restart',
                  title: 'add another',
                  type: 'button'
                }],
                open: true
              };
            }
            return {
              title: 'Configure Smart Group',
              choices: [{
                id: 'STEP_3_ENTER_SMART_GROUP_FILTER',
                type: 'text',
                title: 'Group Filter'
              }],
              open: true
            }
          }

          return {
            title: 'Configure Smart Group',
            choices: [{
              id: 'STEP_2_ENTER_SMART_GROUP_NAME',
              type: 'text',
              title: 'Group Name'
            }],
            open: true
          }
        break;
        default:
          this.nextStep = errorStep(`Not a valid choice ${typeChoice.value}`);
      }
    }
  }

  // return choices to UI
  return {
    nextStep: function() {
      // set up next step
      this.nextStep = step1.bind(this);
      // since we're here it must be the inital step
      return _initialStep;
    }
  }
}

export const processTypes = {
  ADD_ROSTER_ITEM: addRosterItemProcess
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
            runningProcess = new Process();
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
