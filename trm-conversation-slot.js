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
          const jid = this.get('jid');
          if (!jid) {
            return 'WARN: Unconfigured Editor!!'
          }
          const contact = state.roster.byId[jid];
          if (!contact) {
            return jid;
          }
          return contact.name;
        }
      }
    });
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
}

window.customElements.define(TRMConversationSlot.is, TRMConversationSlot);
