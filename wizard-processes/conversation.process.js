export function createConversation({dispatch, getState}) {

  const initialChoices = [{
      id: 'STEP_1_CHOICE_CONTACT',
      title: 'Contact',
      type: 'button'
    }, {
      id: 'STEP_1_CHOICE_CHATROOM',
      title: 'Chatroom',
      type: 'button'
    }, {
      id: 'STEP_1_CHOICE_MERGED',
      title: 'Merged',
      type: 'button'
    }, {
      id: 'STEP_1_CHOICE_MARKET',
      title: 'Market',
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

  function finished(next, conversation, choice) {
    next(conversation, choice.value);
    return {
      title: '',
      choices: [],
      open: false
    };
  }

  function createMergedConversation(conversation, participants) {
    const merged = Object.assign({}, conversation, {participants});
    console.log('creating merged chatroom:', merged);
    return;
    dispatch({
      type: 'API.CONVERSATIONS.OPEN',
      data: merged
    })
  }

  function addParticipants(conversation, choice) {
    const namedConversation = Object.assign({}, conversation, {name: choice.value});
    console.log('asking to add participants to', namedConversation);
    this.nextStep = finished.bind(this, createMergedConversation, namedConversation);
    return {
      title: 'Enter Email',
      choices: [{
        id: 'STEP_2_ADD_PARTICIPANTS',
        title: 'Add Participants',
        type: 'quickselect'
      }],
      open: true
    }
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
          this.nextStep = finished.bind(this, joinChatroom, {type: 'chatroom'});
          return {
            title: 'Enter Chatroom ID',
            choices: [{
              type: 'email'
            }],
            open: true
          }
        break;

        case 'STEP_1_CHOICE_MERGED' :
          this.nextStep = addParticipants.bind(this, {
            type: 'merged'
          });
          return {
            title: 'Merged Conversation Name',
            choices: [{
              id: 'STEP_2_ENTER_MERGED_NAME',
              title: 'Enter Name',
              type: 'text'
            }],
            open: true
          }
        break;

        case 'STEP_1_CHOICE_MARKET' :
          this.nextStep = function(groupName) {
            console.log('step 2 market name is', groupName);
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
