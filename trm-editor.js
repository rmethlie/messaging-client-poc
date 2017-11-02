
/**
 * `trm-editor`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
// init store
import './params.js';
import { ReduxMixin } from './store.js';
class TRMEditor extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-editor'; }
  static get properties() {
    return {
      title: {
        type: String,
        statePath: function(state) {
          const jid = this.get('jid');
          if (!jid) {
            return 'WARN: Unconfigured Editor!!'
          }
          const contact = state.roster.byId[jid];
          if (!contact) {
            return jid;
          }
          return contact.name;
        }
      },
      jid: {
        type: String
      },
      'data-parent-id': {
        type: String
      },
      enabled: {
        type: Boolean,
        statePath: function(state) {
          return state.containers.active === this.get('data-parent-id');
        },
        observer: '_enabledChanged'
      }
    }
  }

  _enabledChanged(enabled) {
    if (this.editor && !!enabled) {
      this.focus();
    }
  }

  restoreRange() {
    if (this.editor.childNodes.length) {
      const selection = this.shadowRoot.getSelection();
      selection.removeAllRanges();
      selection.addRange(this._range);
    }
  }

  storeRange() {
    const selection = this.shadowRoot.getSelection();
    this._range = selection.getRangeAt(0);
  }

  focus() {
    this.restoreRange();
    this.editor.focus();
  }

  handleKeyUp(event) {
    switch (event.key) {
      case 'Enter':
        console.log('user pressed RETURN');
        console.log('value', this.editor.value);
        console.log('innerHTML', this.editor.innerHTML);
      break;

      default:
        console.log(event.key);
    }
  }


  // on our way out, make sure to store the current selection range, which
  // includes cursor position.
  handleFocusOut() {
    this.storeRange();
  }

  initContentEditable() {
    this.editor = this.shadowRoot.querySelector('.editable')
    this.shadowRoot.querySelector('.editable-container').appendChild(this.editor);
    this.addEventListeners();
  }

  addEventListeners() {
    this.editor.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.editor.addEventListener('focusout', this.handleFocusOut.bind(this));
    this.editor.addEventListener('focus', this.handleFocus.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.initContentEditable();
  }
}

window.customElements.define(TRMEditor.is, TRMEditor);
