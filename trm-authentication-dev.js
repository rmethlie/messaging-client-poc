import { ReduxMixin } from './store.js';
export default class TRMAuthenticationDev extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-authentication-dev'; }
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

  connectedCallback() {
    super.connectedCallback();
    this.dispatch({
      type: 'CONNECT',
      data: {
        jid: 'russ2.methlie.thomsonreuters.com@reuasmb.net',
        password: 'Welcome1'
      }
    });
  }
}
window.customElements.define(TRMAuthenticationDev.is, TRMAuthenticationDev);
