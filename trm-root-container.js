/**
 * `trm-container`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
export default class TRMRootContainer extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-root-container'; }
  static get properties() {
    return {
      initialized: {
        type: Boolean,
        statePath: function(state) {
          const id = this.id || 'root';
          return !!state.containers.byId[id];
        },
        value: false
      },
      containers: {
        type: Array,
        statePath: function(state) {
          const containerId = this.id || 'root';
          const containerConfig = state.containers.byId[containerId];
          if (containerConfig) {
            return containerConfig.containers.length ? [...containerConfig.containers] : false;
          }
          return [];
        }
      },

      containersClasses: {
        type: String,
        statePath: function(state) {
          const containerConfig = state.containers.byId['root'];
          if (containerConfig) {
            const layout = containerConfig.layout;
            const classList = ['containers'];
            // left right (row) or up down (column)
            if (this.id === 'root') {
              classList.push('row');
            } else {
              classList.push(layout.flow);
            }
            return classList.join(' ');
          }
          return '';
        }
      },
      title: {
        type: String,
        value: "Root Container"
      }
    };
  }
}

window.customElements.define(TRMRootContainer.is, TRMRootContainer);
