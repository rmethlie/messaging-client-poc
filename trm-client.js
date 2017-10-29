/**
 * `trm-connection`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
// init store
import './params.js';
import { ReduxMixin } from './store.js';
class TRMClient extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-client'; }

  connectedCallback() {
    super.connectedCallback();
    const authType = this.getAttribute('authType') || 'simple';
    // super simple connect type for now
    this.dispatch({
      type: 'API.CONNECTION.CONNECT',
      data: {
        authType,
        credentials: {
          jid: params.jid,
          password: params.password
        }
      }
    });
  }
}

window.customElements.define(TRMClient.is, TRMClient);
