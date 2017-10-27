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
}

window.customElements.define(TRMClient.is, TRMClient);
