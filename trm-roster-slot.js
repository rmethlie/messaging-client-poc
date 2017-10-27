/**
 * `trm-roster-slot`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import TRMContainerSlot from './trm-container-slot.js';
export default class TRMRosterSlot extends TRMContainerSlot {
  static get is() { return 'trm-roster-slot'; }
  static get properties() {
    const inherited = TRMContainerSlot.properties;
    return Object.assign({}, inherited, {
      index: {
        type: String
      },
      content: {
        type: Object,
        statePath: function(state) {
          const defaultContent = {
            jid: '???',
            name: '???',
            email: '???',
            company: '???',
            presence: 'unavailable',
            status: ''
          };
          const rosterItem = state.roster.byId[this.id];
          if (rosterItem) {
            const {jid, name, email, company} = rosterItem;
            return Object.assign(defaultContent, {jid, name, email, company});
          }
          return defaultContent;
        }
      },
      slotClasses: {
        type: String,
        statePath: function(state) {
          const slotContainerConfig = state.containers.byId[this.id];
          const classList = ['slot'];
          if (slotContainerConfig) {
            // left right (row) or up down (column)
            classList.push(slotContainerConfig.layout);
          }
          return classList.join(' ');
        }
      },

      presenceClasses: {
        type: String,
        statePath: function(state) {
          const presenceItem = state.presence[this.id];
          if (presenceItem) {
            return `presence ${presenceItem.presence}`;
          }
          return 'unknown';
        }
      }
    });
  }

  showIndex() {
    this.shadowRoot.querySelector('.index').classList = ['index visible'];
  }

  hideIndex() {
    this.shadowRoot.querySelector('.index').classList = ['index'];
  }

  handleClick(event) {
    const jid = this.id;
    this.dispatch({
      type: 'API.CONVERSATIONS.OPEN',
      data: {jid}
    });
  }

  getTools() {
    return [...super.getTools(),
      {action: 'EXPAND', label: '+'}
    ];
  }
}

window.customElements.define(TRMRosterSlot.is, TRMRosterSlot);
