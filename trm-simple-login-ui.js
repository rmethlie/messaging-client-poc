/**
 * `trm-connection`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
class TRMSimpleLoginUI extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-simple-login-ui'; }
  static get properties() {
    return {
      authenticated: {
        type: Boolean,
        statePath: state => state.authentication.status === 'AUTHENTICATED'
      },
      jid: String
    };
  }

  onSubmit(event) {
    // important.  without it, loops abound...
    event.preventDefault();
    // get the values
    const jidd = event.target.jid.value;
    const password = event.target.password.value;
    // dispatch the action
    this.dispatch({
      type: 'AUTHENTICATE_SIMPLE',
      data: {jid, password}
    });
    event.target.password.value = '';
  }
}

window.customElements.define(TRMSimpleLoginUI.is, TRMSimpleLoginUI);
