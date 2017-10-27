export const defaultContainersState = {
  byId: {},
  active: null
}

const generateContainerId =
  () => `${Math.floor(Math.random() * (1000000 - 1) + 1)}`;

function createContainer(container) {
  const id = container.id || generateContainerId();
  return Object.assign({}, {
    id,
    type: 'container',
    slots: [],
    containers: [],
    peristent: false,
    layout: {
      flow: 'column wrap',
      locked: false
    }
  }, container);
}

function getContainer(state, containerId) {
  return state.byId[containerId];
}

function addContainer(state, action) {
  // default to root for parent
  const newContainer = getContainer(state, action.data.id) || createContainer(action.data);
  // cant be your own child
  if (newContainer.id === newContainer.parent) {
    console.warn('Container cannot have same id as parent', newContainer);
    return state;
  }
  // cant have parent as one of your own containers
  if (newContainer.containers && newContainer.containers.indexOf(newContainer.parent) > -1) {
    console.warn('Container cannot contain its parent', newContainer);
    return state;
  }
  // go get the parent
  const parentContainer = state.byId[newContainer.parent];
  // if there is a parent, and container is not already a child
  if (parentContainer && parentContainer.containers && parentContainer.containers.indexOf(newContainer.id) === -1) {
    // add the container as a new child
    parentContainer.containers = [...parentContainer.containers, newContainer.id];
  }
  // add container to the flat index
  state.byId = Object.assign({}, state.byId, {
    [newContainer.id]: newContainer
  });
  // set active if asked to.
  if (action.data.active === true) {
    state.active = newContainer.id;
  }
  // return the new containers object
  return state;
}


function removeContainer(state, action) {
  const idToRemove = action.data.id;
  delete state.byId[idToRemove];
  let byId = {};
  Object.keys(state.byId).forEach((id) => {
    let container = state.byId[id];
    const index = container.containers.indexOf(idToRemove);
    if (index > -1) {
      container.containers.splice(index, 1);
      // make it different
      const newContainer = Object.assign({}, container, {
        containers: [...container.containers]
      });
    }
    byId[container.id] = container;
  });
  return Object.assign({}, state, { byId });
}

function createSlot(slot = {}) {
  return Object.assign({}, {
    type: 'slot',
    id: generateContainerId()
  }, slot)
}

function getSlot(containers, slotId) {
  const slot = containers.byId[slotId];
  if (slot) {
    return Object.assign({}, slot);
  }
  return null;
}

function addSlot(state, action) {
  const { parent, slot } = action.data;
  const container = state.byId[parent];
  // cant be your own child
  if (container.id === slot.id) {
    return state;
  }
  if (container) {
    const newSlot = getSlot(state, slot.id) || createSlot(slot);
    // cant have parent as one of your own slots
    if (container.slots.indexOf(newSlot.id) > -1) {
      return state;
    }
    const newContainer = Object.assign({}, container, {
      slots: [...container.slots, newSlot.id]
    })
    return Object.assign({}, state, {
      byId: Object.assign({}, state.byId, {
        [newContainer.id]: newContainer,
        [newSlot.id]: newSlot
      })
    })
  }
  return state;
}

function removeSlot(state, action) {
  const idToRemove = action.data.id;
  const slot = state.byId[idToRemove];
  let byId = {};
  if (slot) {
    Object.keys(state.byId).forEach((id) => {
      let container = state.byId[id];
      if (container.type === 'slot') {
        return;
      }
      const index = container.slots.indexOf(idToRemove);
      if (index > -1) {
        container.slots.splice(index, 1);
        // make it different
        const newContainer = Object.assign({}, container, {
          slots: [...container.slots]
        });
      }
      byId[container.id] = container;
    });
    delete byId[idToRemove];
    return Object.assign({}, state, byId);
  }
  return state;
}

function setLayout(state, action) {
  const container = state.byId[action.data.id];
  if (container) {
    const updatedContainer = Object.assign({}, container);
    updatedContainer.layout =
      Object.assign({}, updatedContainer.layout, action.data);
    return Object.assign({}, state, {
      byId: Object.assign({}, state.byId, {[updatedContainer.id]: updatedContainer})
    });
  }
  return state;
}

function setActive(state, action) {
  const id = action.data.id;
  const container = state.byId[id];
  if (container) {
    return Object.assign({}, state, {active: id});
  }
  return state;
}


export default function containers(state = defaultContainersState, action = {}) {
  switch (action.type) {
    case 'ADD_CONTAINER':
      return addContainer(state, action);
    case 'REMOVE_CONTAINER':
      return removeContainer(state, action);
    case 'ADD_SLOT':
      return addSlot(state, action);
    case 'REMOVE_SLOT':
      return removeSlot(state, action);
    case 'SET_LAYOUT':
      return setLayout(state, action);
    case 'SET_ACTIVE':
      return setActive(state, action);
    default:
      return state;
  }
}
