/**
 * `trm-connection`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
class TRMUserInterface extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-user-interface'; }

  connectedCallback() {
    super.connectedCallback();
  }
}


window.containers = [];
window.resetAll = function() {
  this.containers.forEach(container => container.reset());
}
window.customElements.define(TRMUserInterface.is, TRMUserInterface);
