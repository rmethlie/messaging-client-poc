/**
 * `trm-wizard`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
import TRMWizardChoice from './trm-wizard-choice.js';
export default class TRMWizard extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-wizard'; }
  static get properties() {
    return {
      title: {
        type: String,
        statePath: 'wizard.title'
      },
      open: {
        type: String,
        statePath: 'wizard.open',
        observer: '_openObserver'
      },
      choices: {
        type: Array,
        statePath: 'wizard.choices',
        observer: '_choicesObserver'
      }
    }
  }

  handleMaskClick(event) {
    if (event.target === this && this.confirmClose()) {
      this.dispatchHide();
    }
  }

  handleChoice(event) {
    const {id, value} = event.detail;
    this.dispatch({
      type: 'API.WIZARD.CHOICE',
      data: {id, value}
    });
  }

  ready() {
    super.ready();
    // all clicks that make it to the host should result
    // in "click outside" behavior
    this.addEventListener('click', this.handleMaskClick.bind(this));
    // clicks inside the container should not make it out
    const container = this.shadowRoot.querySelector('.container');
    // so we listen on the bubble and stop propagation
    container.addEventListener('click', event => event.stopPropagation());
    container.addEventListener('wizard-choice', this.handleChoice.bind(this));
  }

  flash() {
    this.classList.add('flash');
  }

  show() {
    this.classList.add('open');
    this.flash();
  }


  hide() {
    this.classList.remove('open');
  }

  confirmClose() {
    // no no no, but we dont have a dialog yet.
    return true;
    return confirm('Close Wizard in Progress? (TODO: Get rid of this blocking model!)')
  }

  dispatchHide() {
    this.dispatch({
      type: 'API.WIZARD.CLOSE'
    });
  }

  dispatchShow() {
    this.dispatch({
      type: 'API.WIZARD.CLOSE'
    });
  }

  handleCloseClick(event) {
    if (this.confirmClose()) {
      this.dispatchHide();
    }
  }

  _openObserver(open) {
    const action = open ? this.show : this.hide;
    action.call(this);
  }

  _choicesObserver(choices = []) {
    const container = this.shadowRoot.querySelector('.choices');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    for (let i=0; i<choices.length; i++) {
      const choiceEl = new TRMWizardChoice();
      choiceEl.setAttribute('id', i+'');
      container.appendChild(choiceEl);
    }
  }

  stringify(obj) {
    return JSON.stringify(obj, null, 2);
  }

  getTime() {
    return new Date().getTime();
  }
}

window.customElements.define(TRMWizard.is, TRMWizard);
