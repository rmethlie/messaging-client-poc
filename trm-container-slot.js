/**
 * `trm-container`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
export default class TRMContainerSlot extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-container-slot'; }
  static get properties() {
    return {
      title: {
        type: String,
        statePath: function (state) {
          const containerConfig = state.containers.byId[this.id];
          if (containerConfig) {
            return containerConfig.title ?
              containerConfig.title : `Container ${containerConfig.id}`;
          }
          return 'Untitled Container';
        }
      },
      content: {
        type: Object,
        statePath: function(state) {
          const slotContainerConfig = state.containers.byId[this.id];
          if (slotContainerConfig) {
            return slotContainerConfig;
          }
          return {type: 'slot', title: 'unknown slot'}
        }
      },
      id: {
        type: String
      },
      index: {
        type: String
      },
      slotClasses: {
        type: String,
        statePath: function(state) {
          const slotContainerConfig = state.containers.byId[this.id];
          const classList = ['slot'];
          if (slotContainerConfig) {
            // left right (row) or up down (column)
            classList.push(slotContainerConfig.layout);
          }
          return classList.join(' ');
        }
      },

      tools: {
        type: Array,
        value: function() {
          return this.getTools();
        }
      }
    };
  }

  constructor() {
    super();
    this.handleMouse = this.handleMouse.bind(this);
  }

  showIndex() {
    this.shadowRoot.querySelector('.index').classList = ['index visible'];
  }

  hideIndex() {
    this.shadowRoot.querySelector('.index').classList = ['index'];
  }

  handleClick(event) {
    console.log('click');
  }

  handleMouse(event) {
    switch (event.type) {
      case 'click':
        this.handleClick(event);
        event.preventDefault();
        break;
      case 'mouseover':
        this.showIndex();
        break;
      case 'mouseout':
        this.hideIndex();
        break;
    }
  }

  ready() {
    super.ready();
    this.addEventListener('mouseover', this.handleMouse);
    this.addEventListener('mouseout', this.handleMouse);
    this.addEventListener('click', this.handleMouse);
  }

  getTools() {
    return [];
  }

}

window.customElements.define(TRMContainerSlot.is, TRMContainerSlot);
