/**
 * `trm-wizard`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { re_EMAIL } from './regexp.js';
import { ReduxMixin } from './store.js';
export default class TRMWizardChoice extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-wizard-choice'; }
  static get properties() {
    return {
      id: {
        type: String
      },
      title: {
        type: String,
        statePath: function(state) {
          const choices = state.wizard.choices;
          if (choices.length === 0) {
            return [];
          }
          const index = parseInt(this.getAttribute('id'));
          const choice = choices[index];
          if (choice) {
            return choice.title;
          }
          return this.get('title');
        }
      },
      type: {
        type: String,
        statePath: function(state) {
          const choices = state.wizard.choices;
          if (choices.length === 0) {
            return [];
          }
          const index = parseInt(this.getAttribute('id'));
          const choice = choices[index];
          if (choice) {
            return choice.type;
          }
          return this.get('type');
        }
      }
    }
  }

  flash() {
    this.classList.add('flash');
  }

  disable() {
    this.classList.add('disabled');
    this.flash();
  }


  enable() {
    this.classList.remove('disabled');
  }

  handleButtonClick(event) {
    event.stopPropagation();
    const id = this.getAttribute('id');
    this.dispatchEvent(new CustomEvent('wizard-choice', {
      detail: {id},
      bubbles: true,
      composed: true
    }));
  }

  isValidEmail(email = '') {
    return re_EMAIL.test(email);
  }

  handleEmailChange(event) {
    event.stopPropagation();
    const id = this.getAttribute('id');
    const value = event.target.value;
    if (this.isValidEmail(value)) {
      this.dispatchEvent(new CustomEvent('wizard-choice', {
        detail: {id, value},
        bubbles: true,
        composed: true
      }));
    } else {
      console.error('BAD EMAIL', value);
    }
  }


  handleTextChange(event) {
    event.stopPropagation();
    const id = this.getAttribute('id');
    const value = event.target.value;
    this.dispatchEvent(new CustomEvent('wizard-choice', {
      detail: {id, value},
      bubbles: true,
      composed: true
    }));
  }

  dispatchChosen() {
    this.dispatch({
      type: 'API.WIZARD.CLOSE'
    });
  }

  _openChangeListener(open) {
    const action = open ? this.show : this.hide;
    action.call(this);
  }

  _choicesChangeListener(choices) {
    if (choices.length) {
      this.flash();
    }
  }

  getType() {
    const id = this.getAttribute('id');
    const choices = this.getState().wizard.choices;
    const choice = choices[id];
    return choice ? choice.type : 'unknown';
  }

  isButton() {
    return this.getType() === 'button';
  }

  isEmail() {
    return this.getType() === 'email';
  }

  isChatroom() {
    return this.getType() === 'chatroom';
  }

  isText() {
    return this.getType() === 'text';
  }

  isUnknown() {
    return this.getType() === 'unknown';
  }

  isPassword() {
    return this.getType() === 'password';
  }
}

window.customElements.define(TRMWizardChoice.is, TRMWizardChoice);
