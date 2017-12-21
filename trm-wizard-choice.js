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

  ready() {
    super.ready();
    const type = this.getCapitalizedType();
    const init = this[`init${type}`];
    init.call(this);
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

  handleQuickSelect(event) {
    const jid = event.detail.value;
    if (this.quickSelectItems.indexOf(jid) === -1) {
      console.log('wizard added jid', jid);
      this.quickSelectItems.push(jid);
      const items = this.shadowRoot.querySelector('.quickselect-items');
      const item = document.createElement('div');
      item.innerHTML = jid;
      items.appendChild(item);
    }
  }

  handleQuickSelectSubmit() {
    const value = this.quickSelectItems;
    const id = this.getAttribute('id');
    this.dispatchEvent(new CustomEvent('wizard-choice', {
      detail: {id, value},
      bubbles: true,
      composed: true
    }));

    const items = this.shadowRoot.querySelector('.quickselect-items');
    items.innerHTML = '';
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

  getCapitalizedType() {
    const type = this.getType() || 'unknown';
    if (type) {
      return `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
    }
  }

  getType() {
    const id = this.getAttribute('id');
    const choices = this.getState().wizard.choices;
    const choice = choices[id];
    return choice ? choice.type : 'unknown';
  }

  getTypeContainer() {
    const type = this.getType();
    return this.shadowRoot.querySelector(`[data-type="${type}"]`);
  }

  showContainer(container) {
    container.style.display = 'block';
  }

  hideContainer(container) {
    container.style.display = 'none';
  }

  initButton() {
    // just need to show it
    this.getTypeContainer().style.display = 'block';
  }

  initEmail() {
    const container = this.getTypeContainer();
    this.showContainer(container);
  }

  initText() {
    const container = this.getTypeContainer();
    this.showContainer(container);
  }

  initUnknown() {
    const container = this.getTypeContainer();
    this.showContainer(container);
  }

  initPassword() {
    const container = this.getTypeContainer();
    this.showContainer(container);
  }

  initQuickselect() {
    const container = this.getTypeContainer();
    container.addEventListener('quickselect', this.handleQuickSelect.bind(this));
    this.showContainer(container);
    this.quickSelectItems = [];
  }
}

window.customElements.define(TRMWizardChoice.is, TRMWizardChoice);
