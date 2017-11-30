/**
 * `trm-connection`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
import { defaultUIState } from './ui.reducer.js';
class TRMUISplitter extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-ui-splitter'; }
  static get properties() {
    return {
      style: {
        type: String,
        statePath: function(state) {
          const rosterWidth = state.ui.rosterWidth;
          return `left: ${rosterWidth}px`;
        }
      }
    }
  }

  dispatchChange(rosterWidth) {
    this.dispatch({
      type: 'UI.SET.ROSTER_WIDTH',
      data: {rosterWidth}
    })
  }

  getNewWidth(mouseX) {
    const rosterWidth = defaultUIState.rosterWidth;
    const newWidth = mouseX <= rosterWidth ? rosterWidth : mouseX;
    return newWidth;
  }

  onMouseUp(event) {

    if (!!event.x) {
      const newWidth = this.getNewWidth(event.x);
      this.dispatchChange(newWidth);
    }
    document.body.style.userSelect = null;
    document.body.style.cursor = null;
    
    document.body.removeEventListener('mouseup', this._onMouseUp);
    document.body.removeEventListener('mousemove', this._onMouseMove);
    document.body.removeChild(this.ghost);
  }

  onMouseDown(event) {
    // turn off selectability of page
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';

    // create a proxy div
    this.ghost = document.createElement('div');
    // style it
    this.ghost.style.position = 'absolute';
    this.ghost.style.top = 0;
    this.ghost.style.width = '5px';
    this.ghost.style.bottom = 0;
    // set 'left' to current mouse x position
    this.ghost.style.left = `${event.x}px`;
    this.ghost.style.zIndex = 99999999;
    this.ghost.style.backgroundColor = '#aaa';
    this.ghost.style.opactiy = '0.3';
    // create and store refs to bound handler functions so we can remove them
    // properly
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    // add the listeners
    document.body.addEventListener('mouseup', this._onMouseUp);
    document.body.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('blur', this._onMouseUp);
    // add the element to the page.
    document.body.appendChild(this.ghost);
  }

  onMouseMove(event) {
    this.ghost.style.left = `${this.getNewWidth(event.x)}px`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mousedown', this.onMouseDown.bind(this));
  }
}

window.customElements.define(TRMUISplitter.is, TRMUISplitter);
