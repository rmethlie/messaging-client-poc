/**
 * `trm-toolbar`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
class TRMToolbar extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-toolbar'; }
  static get properties() {
    return {
      tools: {
        type: Array,
        value: []
      }
    };
  }

  getTools() {
    return this.toolConfigurations;
  }

  handleToolClick(event) {
    this.dispatchEvent(new CustomEvent('toolaction', {
      detail: {
        action: event.target.getAttribute('data-tool-action')
      },
      bubbles: true,
      composed: true
    }));
  }


  connectedCallback() {
    super.connectedCallback();
    // only let <tool/> nodes pass
    function onlyTools(node) {
      return node.nodeName === 'TOOL';
    }

    function toolAttributes(tool) {
      return {
        action: tool.getAttribute('action'),
        label: tool.getAttribute('label')
      }
    }
    this.changeObserver = new Polymer.FlattenedNodesObserver(this, (info) => {
      this.set('tools', info.addedNodes.filter(onlyTools).map(toolAttributes));
    });
  }

}

window.customElements.define(TRMToolbar.is, TRMToolbar);
