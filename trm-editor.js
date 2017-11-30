
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
      if (this._range) {
        selection.addRange(this._range);
      }
    }
  }

  storeRange() {
    const selection = this.shadowRoot.getSelection();
    if (selection.rangeCount) {
      this._range = selection.getRangeAt(0);
    }
    this._range = null;
  }

  focus() {
    const focusedEditor = this.shadowRoot.querySelector('.editable:focus')
    if (!focusedEditor) {
      this.restoreRange();
      this.editor.focus();
    }
  }

  handleKeyUp(event) {
    switch (event.key) {
      case 'Enter':
        console.log('user pressed RETURN');
        console.log('value', this.editor.value);
        console.log('innerHTML', this.editor.innerHTML);
      break;
    }
  }


  // on our way out, make sure to store the current selection range, which
  // includes cursor position.
  handleFocusOut() {
    this.storeRange();
  }

  handleDoubleClick() {
    const id = this.getAttribute('data-parent-id');
    console.log('double click', id);
    this.dispatch({
      type: 'API.EDITOR.SHOW',
      data: {id}
    });
  }

  initContentEditable() {
    this.editor = this.shadowRoot.querySelector('.editable')
    this.shadowRoot.querySelector('.editable-container').appendChild(this.editor);
    this.addEventListeners();
  }

  addEventListeners() {
    this.editor.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.editor.addEventListener('focusout', this.handleFocusOut.bind(this));
    this.editor.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    // this.editor.addEventListener('focus', this.handleFocus.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.initContentEditable();
  }
}

window.customElements.define(TRMEditor.is, TRMEditor);
