
/**
 * `trm-advanced-editor`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
// init store
import './params.js';
import { ReduxMixin } from './store.js';
import TRMConversationContainer from './trm-conversation-container.js';
import TRMPresence from './trm-presence.js';
class TRMAdvancedEditor extends TRMConversationContainer {
  static get is() { return 'trm-advanced-editor'; }
  static get properties() {
    return {
      jid: {
        type: String,
        statePath: 'editor.jid',
        observer: '_jidChanged'
      },

      active: {
        type: Boolean,
        statePath: 'editor.active',
        observer: '_activeChanged'
      },

      slots: {
        type: Array,
        statePath: function(state) {
          const { slots } = this.getConfig(this.jid, state);
          if (slots) {
            return slots.length ? [...slots] : false;
          }
          return false;
        }
      },

      title: {
        type: String,
        statePath: function (state) {
          const jid = this.get('jid');
          const contact = state.roster.byId[jid];
          if (contact) {
            return contact.name;
          }
          return jid;
        }
      }
    }
  }

  getCard() {
    const card = new TRMPresence();
    const jid = this.jid || this.get('jid') || this.getAttribute('jid');
    card.setAttribute('jid', jid);
    return card;
  }

  showCard() {
    const card = this.getCard();
    const cardContainer = this.shadowRoot.querySelector('.card');
    const existing = cardContainer.firstChild;
    if (existing) {cardContainer.removeChild(existing)}
    cardContainer.appendChild(card);
  }

  _jidChanged(jid) {
    console.log('showing advanced editor for', jid);
  }

  _activeChanged(active) {
    if (active) {
      console.log('making adv editor ACTIVE with JID:', this.jid);
      this.classList = ['active'];
      this.focus();
      this.showCard();
    } else {
      console.log('making adv editor INACTIVE.');
      this.classList = [];
    }
  }

  handleClickOutside(event) {
    event.stopPropagation();
    // TODO: This should be automatic
    this.editor.handleFocusOut();
    this.dispatch({
      type: 'API.EDITOR.HIDE'
    });
  }

  handleKeyUp(event) {
    if (event.key === 'Escape') {
      this.dispatch({
        type: 'API.EDITOR.HIDE'
      });
    }
  }

  addEventListeners() {
    // this.shadowRoot.querySelector('.sensor')
    //   .addEventListener('click', this.handleClickOutside.bind(this), true);
    this.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  focus() {
    function focusEditor() {
      this.editor.focus();
    }
    setTimeout(focusEditor.bind(this), 1);
  }

  ready() {
    super.ready();
    this.editor = this.shadowRoot.querySelector('trm-editor');
    this.addEventListeners();
    this.showCard();
    this.focus();
  }
}

window.customElements.define(TRMAdvancedEditor.is, TRMAdvancedEditor);
