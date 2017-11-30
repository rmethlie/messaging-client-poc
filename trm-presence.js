/**
 * `trm-presence`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
export default class TRMPresence extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-presence'; }
  static get properties() {
    return {
      jid: String,
      presenceClasses: {
        type: String,
        statePath: function(state) {
          const presenceItem = state.presence[this.get('jid')];
          if (presenceItem) {
            return `presence ${presenceItem.presence}`;
          }
          return 'presence unknown';
        }
      }
    }
  }
}

window.customElements.define(TRMPresence.is, TRMPresence);
