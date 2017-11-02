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
      }
    });
  }
}

window.customElements.define(TRMConversationContainer.is, TRMConversationContainer);
