/**
 * `trm-presence`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { store } from './store.js';
export default class TRMPresence extends Polymer.Element {
  static get is() { return 'trm-presence'; }
  static get properties() {
    return {
      jid: String
    }
  }

  constructor() {
    super();
    this.getState = store.getState.bind(store);
    this.currentPresence = this.readPresenceFromStore();
    this.classList = [this.currentPresence];
    store.subscribe(this.onStoreChange.bind(this));
  }

  readPresenceFromStore() {
    const item = this.getState().presence[this.get('jid')];
    if (item) {
      return item.presence;
    }
    return 'unavailable';
  }

  onStoreChange() {
    const storedPresence = this.readPresenceFromStore();
    if (storedPresence !== this.currentPresence) {
      // cache the value
      this.currentPresence = storedPresence;
      // set the class
      this.classList = [this.currentPresence];
    }
  }
}

window.customElements.define(TRMPresence.is, TRMPresence);
