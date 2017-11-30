/**
 * `trm-container`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import TRMContainer from './trm-container.js';
export default class TRMConversationContainer extends TRMContainer {
  static get is() { return 'trm-conversation-container'; }
  static get properties() {
    const inheritedProperties = TRMContainer.prototype.properties;
    return Object.assign({}, inheritedProperties, {
      id: {
        type: String
      },
      containers: {
        type: Array,
        value: []
      }
    });
  }

  handleClick(event) {
    super.handleClick(event);
    const editor = this.shadowRoot.querySelector('trm-editor');
    editor.focus();
  }

  getTools() {

    return [...super.getTools(),
      {action: 'INCREASE_SLOT_SIZE', label: `${String.fromCharCode(8593)} Slot Size`},
      {action: 'DECREASE_SLOT_SIZE', label: `${String.fromCharCode(8595)} Slot Size`}
    ];
  }
}

window.customElements.define(TRMConversationContainer.is, TRMConversationContainer);
