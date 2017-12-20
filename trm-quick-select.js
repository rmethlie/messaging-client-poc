/**
 * `trm-quick-select`
 *
 *
 * @customElement
 * @polymer
 * @trm3 index.html
 */
import { ReduxMixin } from './store.js';
export default class TRMQuickSelect extends ReduxMixin(Polymer.Element) {
  static get is() { return 'trm-quick-select'; }
  static get properties() {
    return {
      type: {
        type: String
      },
      results: {
        type: Array,
        statePath: function(state) {
          const id = this.get('id');
          return state.quickSelect.results[id];
        }
      },
      width: String
    };
  }

  constructor() {
    super();
    this.set('id', this.generateId());
    this.allowed = /[a-zA-Z0-9'\-]/;
    this.currentIndex = 0;
  }

  generateId() {
    const rand = Math.ceil(Math.random(2));
    return `${new Date().getTime()}-${rand}`;
  }

  createQueryDispatcher(query) {
    const type = this.get('type');
    const id = this.get('id');
    if (query && query.length >= 3) {
      return this.dispatch.bind(this, {
        type: "API.QUICKSELECT.SEARCH",
        data: {id, type, query: {
          name: query
        }}
      });
    } else {
      return this.dispatch.bind(this, {
        type: "API.QUICKSELECT.CLEAR",
        data: {id}
      });
    }
  }

  dispatchQuery(query) {
    window.clearTimeout(this.queryId);
    // get the select type
    // set up a query action to dispatch
    console.log('query:', query);
    const dispatchQueryFunction =
      this.createQueryDispatcher(query);
    // store the timeout id in case we cancel later
    this.queryId =
      window.setTimeout(dispatchQueryFunction, 250);
  }

  appendKeyToQuery(query, key) {
    return this.allowed.test(key) ? `${query}${key}` : query;
  }

  onInputKeyPress(event) {
    // get the current input value
    const currentQuery = event.target.value;
    // get the pressed key
    const key = event.key;
    // construct the query
    const query = this.appendKeyToQuery(currentQuery, key);
    // dispatch.  this will likely be debounced...
    this.dispatchQuery(query);
  }

  onKeyDown(event) {
    switch (event.key) {
      case 'Backspace': {
        // count is 4 here, because 'value' of input has not
        // yet been updated, so 'length' is +1
        if (event.target.value.length < 4) {
          // clear the query for anything less than 3 chars
          this.dispatchQuery('');
        }
        break;
      }

      case 'Escape': {
        this.dispatchQuery('');
        const input = this.shadowRoot.querySelector('input');
        input.value = '';
        input.blur();
        break;
      }

      case 'ArrowDown': {
        const results = this.shadowRoot.querySelectorAll('.result');
        let index = results.length;
        this.currentIndex += 1;
        if (this.currentIndex >= index) {
          this.currentIndex = 0;
        } else if (this.currentIndex < 0) {
          this.currentIndex = results.length - 1;
        }
        while (index--) {
          const classList = ['result'];
          if (index === this.currentIndex) {
            classList.push('selected');
          }
          results[index].classList = classList.join(' ');
        }
        break;
      }
      default: return;// do nothing.
    }

  }

  onResultClick(event) {
    if (event.target.nodeName === 'BUTTON') {
      console.log(event.target.value);
      const value = event.target.value;
      this.dispatchEvent(new CustomEvent('quickselect', {
        detail: {value},
        bubbles: true,
        composed: true
      }));
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.width = this.get('width') || '100%';
  }

  ready() {
    super.ready();
    const input = this.shadowRoot.querySelector('input');
    const boundOnInputKeyPress = this.onInputKeyPress.bind(this);
    const boundOnKeyDown = this.onKeyDown.bind(this);
    // input.addEventListener('change', boundOnInputKeyPress);
    input.addEventListener('keypress', boundOnInputKeyPress);
    input.addEventListener('keydown', boundOnKeyDown);
    input.addEventListener('click', function(event) {
      event.stopPropagation();
    }, true);
    const results = this.shadowRoot.querySelector('.results');
    results.addEventListener('click', this.onResultClick.bind(this));
  }
}

window.customElements.define(TRMQuickSelect.is, TRMQuickSelect);
