/**
 * `trm-container`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
export const CONTAINER_SIZES = [
  'small', 'medium', 'large', 'x-large'
];

export const SLOT_SIZES = [
  '15%', '24%', '49%', '100%'
];

import { ReduxMixin } from './store.js';
import { defaultContainerState } from './containers.reducer.js';
export default class TRMContainer extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-container'; }
  static get properties() {
    return {
      initialized: {
        type: Boolean,
        statePath: function(state) {
          const id = this.id || this.getAttribute('id');
          return !!state.containers.byId[id];
        },
        value: false
      },
      active: {
        type: Boolean,
        statePath: function(state) {
          const id = this.id || this.getAttribute('id');
          return state.containers.active === id;
        },
        observer: '_activeChange'
      },
      title: {
        type: String,
        statePath: function (state) {
          const { id, title } = this.getConfig();
          return title || `Container ${id}`;
        }
      },
      containers: {
        type: Array,
        statePath: function(state) {
          const { containers } = this.getConfig();
          return containers.length ? [...containers] : false;
        }
      },
      slots: {
        type: Array,
        statePath: function(state) {
          const { slots } = this.getConfig();
          return slots.length ? [...slots] : false;
        }
      },
      id: {
        type: String
      },
      slotsClasses: {
        type: String,
        statePath: function(state) {
          const id = this.id || this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig) {
            const layout = containerConfig.layout;
            const classList = ['slots'];
            // left right (row) or up down (column)
            classList.push(layout.flow);
            // window.setTimeout(this.updateSlotSize.bind(this));
            return classList.join(' ');
          }
          return 'slotuhoh';
        }
      },
      containersClasses: {
        type: String,
        statePath: function(state) {
          const id = this.id || this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig) {
            const layout = containerConfig.layout;
            const classList = ['containers'];
            // left right (row) or up down (column)
            classList.push(layout.flow);
            classList.push(CONTAINER_SIZES[layout.containerSize]);
            return classList.join(' ');
          }
          return 'containerruhrow';
        }
      },

      tools: {
        type: Array,
        value: function() {
          return this.getTools();
        }
      },

      containerType: {
        type: String,
        statePath: function(state) {
          const id = this.id || this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig) {
            return containerConfig.type;
          }
        }
      },

      style: {
        type: String,
        statePath: function(state) {
          const id = this.id || this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig) {
            const styles = [];
            const slotSize = containerConfig.layout.slotSize;
            if (slotSize) {
              styles.push(`flex-basis: ${SLOT_SIZES[slotSize]} !important`);
            }
            return styles.join(';');
          }
          return '';
        }
      }
    };
  }

  constructor() {
    super();
    this.flows = [{
        label: String.fromCharCode(8617),
        value: 'column wrap'
      }, {
        label: String.fromCharCode(8595),
        value: 'row wrap'
    }];
    this.flowIndex = 0;
  }

  _activeChange(active) {
    if (active) {
      this.classList = ['active'];
    } else {
      this.classList = [];
    }
  }

  getConfig(id, state) {
    const currentState = state || this.getState();
    const configId = id || this.id || this.getAttribute('id');
    const config = currentState.containers.byId[configId];
    if (config) {
      return config;
    }
    return Object.assign({}, defaultContainerState, {id: configId});
  }

  updateSlotSize(slotSize) {
    this.flexBasis = SLOT_SIZES[slotSize];
  }

  handleToolClick(event) {
    const id = this.id || this.getAttribute('id');
    switch (event.detail.action) {
      case 'REMOVE_CONTAINER':
        if (this.containerType === 'root') {
            this.dispatch({
              type: 'REMOVE_CONTAINER',
              data: {
                id
              }
            });
        }
        if (this.containerType === 'container') {
          this.dispatch({
            type: 'REMOVE_SLOT',
            data: {
              id
            }
          });
        }
        break;
      case 'ADD_CONTAINER':
        if (this.containerType === 'root') {
          this.dispatch({
            type: 'ADD_CONTAINER',
            data: {
              parent: id,
              active: true
            }
          });
        }
        if (this.containerType === 'container') {
          this.dispatch({
            type: 'ADD_SLOT',
            data: {
              parent: id,
              slot: {
                title: `Content for ${id}`
              }
            }
          });
        }
        break;

      case 'ADD_SLOT':
        this.dispatch({
          type: 'ADD_SLOT',
          data: {
            parent: id,
            slot: {
              title: `Slot Content for ${id}`
            }
          }
        });
        break;

      case 'CYCLE_FLOW':
        const nextFlow = this.getNextFlow();
        this.dispatch({
          type: 'CONTAINERS.SET_LAYOUT',
          data: {id, flow: nextFlow.value}
        });
        break;

      case 'INCREASE_SLOT_SIZE':
        this.dispatch({
          type: 'API.CONTAINERS.LAYOUT.INCREASE_SLOT_SIZE',
          data: {id}
        });
        break;

      case 'DECREASE_SLOT_SIZE':
        this.dispatch({
          type: 'API.CONTAINERS.LAYOUT.DECREASE_SLOT_SIZE',
          data: {id}
        });
        break;

      case 'INCREASE_CONTAINER_SIZE':
        this.dispatch({
          type: 'API.CONTAINERS.LAYOUT.INCREASE_CONTAINER_SIZE',
          data: {id}
        });
        break;

      case 'DECREASE_CONTAINER_SIZE':
        this.dispatch({
          type: 'API.CONTAINERS.LAYOUT.DECREASE_CONTAINER_SIZE',
          data: {id}
        });
        break;

    }
  }

  increaseSlotSize() {

  }

  decreaseSlotSize() {
    const id = this.get('id');
    const currentSlotSize = parseFloat(this.style.flexGrow || 1);
    const newSlotSize = Math.max(currentSlotSize - 2.5, MIN_SLOT_SIZE);
    if (newSlotSize !== currentSlotSize) {
      this.style.flexGrow = newSlotSize;
      this.dispatch({
        type: 'API.CONTAINERS.LAYOUT.INCREASE_SLOT_SIZE',
        data: {id}
      });
    }
  }

  getFlow() {
    return this.flows[this.flowIndex];
  }

  getNextFlow() {
    this.flowIndex += 1;
    if (this.flowIndex === this.flows.length) {
      this.flowIndex = 0;
    }
    return this.getFlow();
  }

  connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      const toolbar = this.shadowRoot.querySelector('trm-toolbar');
      if (toolbar) {
        toolbar.addEventListener(
          'toolaction',
          this.handleToolClick.bind(this)
        );
      }
    }, 100);
  }

  ready() {
    super.ready();
    this.addEventListener('mouseover', this.handleMouse.bind(this));
    this.addEventListener('mouseout', this.handleMouse.bind(this));
    this.addEventListener('click', this.handleMouse.bind(this));
  }

  getTools() {
    return [
      {action: 'CYCLE_FLOW',    label: 'FLOW'}
    ];
  }

  handleClick() {
    const id = this.id;
    const currentActive = this.getState().containers.active;
    if (currentActive !== id) {
      this.dispatch({
        type: 'SET_ACTIVE',
        data: {id}
      });
    }
  }

  handleMouseOver() {

  }

  handleMouseOut() {

  }

  handleMouse() {
    switch (event.type) {
      case 'click':
        this.handleClick(event);
        break;
      case 'mouseover':
        this.handleMouseOver();
        break;
      case 'mouseout':
        this.handleMouseOut();
        break;
    }
  }
}

window.customElements.define(TRMContainer.is, TRMContainer);
