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
      }
    });
  }

  constructor() {
    super();
    this.set('id', 'conversations');
    this.set('title', 'Conversations Container');
    this.containerType = 'root';
    this.dispatch({
      type: 'ADD_CONTAINER',
      data: {
        id: this.id,
        title: this.title,
        persistent: true,
        type: 'root',
        layout: {
          flow: 'row wrap',
          locked: true
        }
      }
    });
  }

  getTools() {
    return [...super.getTools(),
      {action: 'ADD_CONTAINER', label: '+Container'},
      {action: 'ADD_SLOT', label: '+Slot'}
    ];
  }

  handleToolClick(event) {
    super.handleToolClick(event);
    const id = this.getAttribute('id');
    switch (event.detail.action) {
      case 'ADD_CONTAINER':
        this.dispatch({
          type: 'SET_ACTIVE',
          data: {id, active: true}
        })
      break;
    }
  }
}

window.customElements.define(TRMConversationsContainer.is, TRMConversationsContainer);
