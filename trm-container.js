/**
 * `trm-container`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
export default class TRMContainer extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-container'; }
  static get properties() {
    return {
      initialized: {
        type: Boolean,
        statePath: function(state) {
          const id = this.getAttribute('id');
          return !!state.containers.byId[id];
        },
        value: false
      },
      activeClass: {
        type: String,
        statePath: function(state) {
          return state.containers.active === this.id ? 'active' : '';
        }
      }
      title: {
        type: String,
        statePath: function (state) {
          const id = this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig) {
            return containerConfig.title ?
              containerConfig.title : `Container ${containerConfig.id}`;
          }
          return 'Untitled Container';
        }
      },
      containers: {
        type: Array,
        statePath: function(state) {
          const id = this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig && containerConfig.containers) {
            return containerConfig.containers.length ? [...containerConfig.containers] : false;
          }
          return [];
        }
      },
      slots: {
        type: Array,
        statePath: function(state) {
          const id = this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig && containerConfig.slots) {
            return containerConfig.slots.length ? [...containerConfig.slots] : false;
          }
          console.log('No Slots to render or no container', containerConfig);
          return [];
        }
      },
      id: {
        type: String
      },
      slotsClasses: {
        type: String,
        statePath: function(state) {
          const id = this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig) {
            const layout = containerConfig.layout;
            const classList = ['slots'];
            // left right (row) or up down (column)
            classList.push(layout.flow);
            return classList.join(' ');
          }
          return 'slotuhoh';
        }
      },
      containersClasses: {
        type: String,
        statePath: function(state) {
          const id = this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig) {
            const layout = containerConfig.layout;
            const classList = ['containers'];
            // left right (row) or up down (column)
            classList.push(layout.flow);
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
          const id = this.getAttribute('id');
          const containerConfig = state.containers.byId[id];
          if (containerConfig) {
            return containerConfig.type;
          }
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

  handleToolClick(event) {
    const id = this.getAttribute('id');
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

      case 'CYCLE_FLOW': {
        const nextFlow = this.getNextFlow();
        this.dispatch({
          type: 'SET_LAYOUT',
          data: {id, flow: nextFlow.value}
        });
        break;
      }
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
      this.shadowRoot
        .querySelector('trm-toolbar')
        .addEventListener('toolaction', this.handleToolClick.bind(this));
    }, 100);
  }

  getTools() {
    return [
      {action: 'CYCLE_FLOW',    label: 'FLOW'}
    ];
  }

  handleClick() {
    console.log('click');
    const id = this.id;
    this.dispatch({
      type: 'SET_ACTIVE',
      data: {id}
    })
  }

  handleMouse() {
    switch (event.type) {
      case 'click':
        this.handleClick(event);
        event.preventDefault();
        event.stopPropagation();
        break;
      case 'mouseover':
        this.showIndex();
        break;
      case 'mouseout':
        this.hideIndex();
        break;
    }
  }
}

window.customElements.define(TRMContainer.is, TRMContainer);
