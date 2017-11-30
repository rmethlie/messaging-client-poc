export const MAX_CONTAINER_SIZE = 3;
export const MIN_CONTAINER_SIZE = 0;
export const MAX_SLOT_SIZE = 3;
export const MIN_SLOT_SIZE = 0;

export default function containersMiddleware({ dispatch, getState }) {
  return (next) => {
    return (action) => {
      switch (action.type) {
        case 'API.CONTAINERS.LAYOUT.INCREASE_CONTAINER_SIZE': {
          const id = action.data.id;
          const container = getState().containers.byId[id];
          if (container) {
            const currentContainerSize = container.layout.containerSize;
            // cant be bigger than the max container size
            const newContainerSize =
              Math.min(currentContainerSize + 1, MAX_CONTAINER_SIZE);
            // if we will actually do something helpful...
            if (newContainerSize > currentContainerSize) {
              // tell the reducer about it.
              next({
                type: 'CONTAINERS.SET_LAYOUT',
                data: {id, containerSize: newContainerSize}
              });
            }
          }
          break;
        }

        case 'API.CONTAINERS.LAYOUT.DECREASE_CONTAINER_SIZE': {
          const id = action.data.id;
          const container = getState().containers.byId[id];
          if (container) {
            const currentContainerSize = container.layout.containerSize;
            // cant be bigger than the max container size
            const newContainerSize =
              Math.max(currentContainerSize - 1, MIN_CONTAINER_SIZE);
            // if we will actually do something helpful...
            if (newContainerSize < currentContainerSize) {
              // tell the reducer about it.
              next({
                type: 'CONTAINERS.SET_LAYOUT',
                data: {id, containerSize: newContainerSize}
              });
            }
          }
          break;
        }

        case 'API.CONTAINERS.LAYOUT.INCREASE_SLOT_SIZE': {
          const id = action.data.id;
          const container = getState().containers.byId[id];
          if (container) {
            const currentSlotSize = container.layout.slotSize;
            // cant be bigger than the max container size
            const newSlotSize =
              Math.min(currentSlotSize + 1, MAX_SLOT_SIZE);
            // if we will actually do something helpful...
            if (newSlotSize > currentSlotSize) {
              // tell the reducer about it.
              next({
                type: 'CONTAINERS.SET_LAYOUT',
                data: {id, slotSize: newSlotSize}
              });
            }
          }
          break;
        }

        case 'API.CONTAINERS.LAYOUT.DECREASE_SLOT_SIZE': {
          const id = action.data.id;
          const container = getState().containers.byId[id];
          if (container) {
            const currentSlotSize = container.layout.slotSize;
            // cant be bigger than the max container size
            const newSlotSize =
              Math.max(currentSlotSize - 1, MIN_SLOT_SIZE);
            // if we will actually do something helpful...
            if (newSlotSize < currentSlotSize) {
              // tell the reducer about it.
              next({
                type: 'CONTAINERS.SET_LAYOUT',
                data: {id, slotSize: newSlotSize}
              });
            }
          }
          break;
        }

        default:
          next(action);
      }
    }
  }
}
