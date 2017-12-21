import {
  addRosterItem
} from './wizard-processes/roster-item.process.js';

import {
  createConversation
} from './wizard-processes/conversation.process.js';

const processTypes = {
  ADD_ROSTER_ITEM: addRosterItem,
  CREATE_CONVERSATION: createConversation
}

export default processTypes;
