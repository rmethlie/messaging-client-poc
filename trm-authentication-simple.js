import { ReduxMixin } from './store.js';
export default class TRMAuthenticationSimple extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-authentication-simple'; }
  static get properties() {
    return {
      isAuthenticated: {
        type: Boolean,
        statePath: state => state.authentication.status === 'AUTHENTICATED'
      },
      status: {
        type: String,
        statePath: 'authentication.status'
      },
      token: {
        type: String,
        statePath: 'authentication.token'
      }
    };
  }
}
window.customElements.define(TRMAuthenticationSimple.is, TRMAuthenticationSimple);
