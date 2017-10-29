/**
 * `trm-container`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
import TRMContainer from './trm-container.js';
class TRMRosterGroupContainer extends TRMContainer {
  static get is() { return 'trm-roster-group-container'; }
  static get properties() {
    const inherited = TRMContainer.properties;
    return Object.assign({}, inherited, {
      // add child props here...
    });
  }

  constructor() {
    super();
    this.flowIndex = 1;
  }

  getTools() {
    return [...super.getTools(),
      {action: 'ADD_ROSTER_SLOT', label: '+Contact'}
    ];
  }
}

window.customElements.define(TRMRosterGroupContainer.is, TRMRosterGroupContainer);
