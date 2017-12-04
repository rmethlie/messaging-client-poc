/**
 * `trm-container`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import TRMContainer from './trm-container.js';
class TRMConversationsContainer extends TRMContainer {
  static get is() { return 'trm-conversations-container'; }
  static get properties() {
    const inherited = TRMContainer.properties;
    return Object.assign({}, inherited, {
      title: {
        type: String,
        value: "Conversations Container val"
      },
      id: {
        type: String,
        value: () => 'conversations'
      },

      style: {
        type: String,
        statePath: function(state) {
          const rosterWidth = state.ui.rosterWidth;
          const splitterWidth = 7;
          // for now they are siblings and push each other around
          return `left: ${rosterWidth + splitterWidth}px;`;
        }
      }
    });
  }

  constructor() {
    super();
    this.set('id', 'conversations');
    this.set('title', 'Conversations Container');
    this.containerType = 'root';
    this.flowIndex = 1;
    this.dispatch({
      type: 'ADD_CONTAINER',
      data: {
        id: this.id,
        title: this.title,
        persistent: true,
        type: 'root',
        layout: {
          flow: 'row wrap',
          locked: true,
          containerSize: 0,
          slotSize: 1
        }
      }
    });
  }

  getTools() {
    return [...super.getTools(),
      {action: 'ADD_CONTAINER', label: '+Container'},
      {action: 'ADD_SLOT', label: '+Slot'},
      {action: 'INCREASE_CONTAINER_SIZE', label: `${String.fromCharCode(8593)} Container Size`},
      {action: 'DECREASE_CONTAINER_SIZE', label: `${String.fromCharCode(8595)} Container Size`}
    ];
  }

  handleClick() {
    // do nothing
  }
}

window.customElements.define(TRMConversationsContainer.is, TRMConversationsContainer);
