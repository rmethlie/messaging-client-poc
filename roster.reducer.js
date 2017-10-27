

function formatItemName(name) {
  const [formattedName, formattedCompany] = name.split('-');
  return {formattedName, formattedCompany};
}

function formatGroupIds(groupIds) {
  // normalizing groupIds
  const formattedGroupIds = typeof groupIds === 'string' ?
    [groupIds] :
    groupIds;
  return formattedGroupIds;
}
// do some fixin...
function normalizeRosterItem(item) {
  const {jid, name, email, company, groupIds} = item;
  const {formattedName, formattedCompany} = formatItemName(name);
  const formattedGroupIds = formatGroupIds(groupIds);
  return {
    jid,
    name: formattedName,
    email,
    company: formattedCompany,
    groupIds: formattedGroupIds
  }
}

// map Nitro roster objects to indexes
function proccessRoster(roster) {
  return roster.reduce((processedRoster, item, index) => {
    // add item byId
    const normalizedItem =
      Object.assign({}, normalizeRosterItem(item), { index });
    processedRoster.byId[item.jid] = normalizedItem;
    // add item to byGroup (stored as jid)
    // iterate groupIds and add to the byGroup object
    normalizedItem.groupIds.forEach((groupId) => {
      // do we already know about this groupId?
      if (!processedRoster.byGroup[groupId]) {
        // no, so assign a new array to a property called [groupId]
        // on the byGroupId object
        processedRoster.byGroup[groupId] = [];
      }
      // push the item onto the now guaranteed groupIds array
      processedRoster.byGroup[groupId].push(normalizedItem.jid);
    });
    return processedRoster;
  }, {
    byId: {},
    byGroup: {}
  });
}

function addToByGroup(byGroup, item) {
  const groupIds = typeof item.groupIds === 'string' ?
    [item.groupIds] : item.groupIds;
  groupIds.forEach((groupId) => {
    const existingJidsByGroup = byGroup[groupId] || [];
    byGroup[groupId] = [...existingJidsByGroup, item.jid];
  });
  return byGroup;
}

const defaultRosterState = {
  count: 0,
  byId: {},
  byGroup: {},
  all: []
}

// actual reducer
export default function roster(state = defaultRosterState, action = {}) {
  switch (action.type) {
    case 'ROSTER.SET': {
      const roster = action.data;
      const { byId, byGroup } = proccessRoster(roster);
      return Object.assign({}, state, {
        count: roster.length,
        byId,
        byGroup,
        all: roster
      })
      break;
    }

    default:
      return state;
  }
}
