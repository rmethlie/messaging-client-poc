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
class TRMRosterContainer extends TRMContainer {
  static get is() { return 'trm-roster-container'; }
  static get properties() {
    const inherited = TRMContainer.properties;
    return Object.assign({}, inherited, {
      title: {
        type: String,
        value: "Roster Container val"
      },
      id: {
        type: String,
        value: 'roster'
      },

      style: {
        type: String,
        statePath: function(state) {
          const rosterWidth = state.ui.rosterWidth;
          return `width: ${rosterWidth}px;`;
        }
      }
    });
  }

  constructor() {
    super();
    this.set('id', 'roster');
    this.set('title', 'Roster Container');
    this.containerType = 'root';
    this.dispatch({
      type: 'ADD_CONTAINER',
      data: {
        id: this.id,
        title: this.title,
        persistent: true,
        type: 'root',
        layout: {
          flow: 'column wrap',
          locked: true,
          containerSize: 0
        }
      }
    });
  }

  getTools() {
    return [...super.getTools(),
      {action: 'ADD_ROSTER_CONTAINER', label: '+Group'},
      {action: 'ADD_ROSTER_SLOT', label: '+Contact'}
    ];
  }

  updateSlotSize(slotSize) {
    // do nothing
  }

  handleClick() {
    // do nothing
  }
}

window.customElements.define(TRMRosterContainer.is, TRMRosterContainer);
