/**
 * `trm-container`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import TRMContainerSlot from './trm-container-slot.js';
export default class TRMConversationSlot extends TRMContainerSlot {
  static get is() { return 'trm-conversation-slot'; }
  static get properties() {
    const inheritedProperties = TRMContainerSlot.properties;
    return Object.assign({}, inheritedProperties, {
      title: {
        type: String,
        statePath: function(state) {
          const id = this.get('id');
          if (!id) {
            return 'WARN: Unconfigured Editor!!'
          }
          const contact = state.roster.byId[id];
          if (!contact) {
            return id;
          }
          const parentContainerId = this.getAttribute('data-parent-id');
          const parentContainer = state.containers.byId[parentContainerId];
          if (parentContainer && parentContainer.layout.flow === 'row wrap') {
            return this.getCompactName(contact.name);
          }
          return contact.name;
        }
      },

      presenceClasses: {
        type: String,
        statePath: function(state) {
          const presenceItem = state.presence[this.get('id')];
          if (presenceItem) {
            return `presence ${presenceItem.presence}`;
          }
          return 'presence unknown';
        }
      },

      toolbarStyle: {
        type: String,
        statePath: function(state) {
          const { layout } = this.getParentConfig();
          if (layout.flow === 'row wrap'){
            return 'display: none';
          }
          return '';
        }
      },

      indexStyle: {
        type: String,
        statePath: function(state) {
          const { layout } = this.getParentConfig();
          if (layout.flow === 'row wrap'){
            return 'display: none';
          }
          return '';
        }
      }
    });
  }

  getCompactName(name) {
    const parts = name.split(' ');
    return parts.map(part => part.substr(0,1).toUpperCase()).join(' ');
  }

  constructor() {
    super();
    window.containers.push(this);
    this.handleMouse = this.handleMouse.bind(this);
  }

  ready() {
    super.ready();
    this.addEventListener('mouseover', this.handleMouse.bind(this));
    this.addEventListener('mouseout', this.handleMouse.bind(this));
    this.addEventListener('click', this.handleMouse.bind(this));
  }

  showIndex() {
    this.shadowRoot.querySelector('.index').classList = ['index visible'];
  }

  hideIndex() {
    this.shadowRoot.querySelector('.index').classList = ['index'];
  }

  handleClick(event) {
    const id = this.get('id');
    this.dispatch({
      type: 'API.EDITOR.SHOW',
      data: {id}
    })
  }
}

window.customElements.define(TRMConversationSlot.is, TRMConversationSlot);
