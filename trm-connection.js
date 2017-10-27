/**
 * `trm-connection`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
class TRMConnection extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-connection'; }
  static get properties() {
    return {
      status: {
        type: String,
        statePath: 'connection.status'
      },
      authTypeSSO: {
        type: Boolean,
        statePath: state => state.authentication.type === 'sso'
      },
      authTypeSimple: {
        type: Boolean,
        statePath: state => state.authentication.type === 'simple'
      },
      authTypeDev: {
        type: Boolean,
        statePath: state => state.authentication.type === 'dev'
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const authType = this.getAttribute('authType') || 'simple';
    if (authType) {
      console.log('setting auth type to', authType);
      this.dispatch({
        type: 'SET_AUTH_TYPE',
        authType
      });
    }
  }
}

window.customElements.define(TRMConnection.is, TRMConnection);
