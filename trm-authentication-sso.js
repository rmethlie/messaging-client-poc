
import { ReduxMixin } from './store.js';
export default class TRMAuthenticationSSO extends ReduxMixin(window.Polymer.Element) {
  static get is() { return 'trm-authentication-sso'; }
  static get properties() {
    return {
      useSSO: {
        type: Boolean,
        statePath: state => state.authentication.type === 'sso'
      },
      useSimple: {
        type: Boolean,
        statePath: state => state.authentication.type === 'simple'
      },
      status: {
        type: String,
        statePath: 'authentication.status'
      },
      token: {
        type: String,
        statePath: 'authentication.token'
      },
      iframeEnabled: {
        type: Boolean,
        value: false
      },
      ssoUrl: {
        type: String,
        statePath: state => {
          return `${state.authentication.config.sso.url}?cacheBust=${new Date().getTime()}&requestId=1`
        }
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.iframeEnabled = true;
    const defaultJID = 'russ3.methlie.thomsonreuters.com@reuasmb.net';
    const defaultPassword = 'Welcome1';
    const jid = params.jid || defaultJID;
    const password = params.password || defaultPassword;
    this.dispatch({
      type: 'AUTHENTICATE_SSO',
      data: {jid, password}
    })
  }
}
