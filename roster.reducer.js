function proccessRoster(roster) {
  return roster.reduce((processedRoster, item, index) => {
    // add item byId
    processedRoster.byId[item.jid] = Object.assign({}, item, { index });
    // add item to byGroup (stored as jid)
    // normalizing groupIds
    const groupIds = typeof item.groupIds === 'string' ?
      [item.groupIds] : item.groupIds;
    // iterate groupIds and add to the byGroup object
    groupIds.forEach((groupId) => {
      if (!processedRoster.byGroup[groupId]) {
        processedRoster.byGroup[groupId] = [];
      }
      processedRoster.byGroup[groupId].push(item.jid);
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
    console.log('existing?', [...existingJidsByGroup, item.jid]);
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
