
import { store } from './store.js';
export default class RosterUIManager {

  constructor() {
    this.dispatch = store.dispatch.bind(store);
    this.getState = store.getState.bind(store);
    store.subscribe(this.onStoreChange.bind(this));
    this.snapshot = {
      all: [],
      byId: {},
      byGroup: {}
    };
  }

  diffRoster(newRoster) {
    const added = newRoster.all.filter(item => !this.snapshot.byId[item.jid]);
    const removed = this.snapshot.all.filter(item => newRoster.byId[item.jid]);
    return { added, removed };
  }

  addGroup(groupId) {
    this.dispatch({
      type: 'ADD_CONTAINER',
      data: {
        parent: 'roster',
        id: groupId,
        layout: {
          flow: 'row wrap'
        }
      }
    })
  }

  addItem(item, groupIds) {
    function dipatcher(groupId) {
      this.dispatch({
        type: 'ADD_SLOT',
        data: {
          parent: groupId,
          slot: {
            id: item.jid,
            title: item.name
          }
        }
      });
      console.log('added', item.jid, 'to', groupId);
    }
    groupIds.forEach(dipatcher.bind(this));
  }

  addItems(items) {
    if (items.length) {
      function dispatcher(item) {
        function groupDispatcher(groupId) {
          this.addGroup(groupId);
        }
        let groupIds = item.groupIds;
        if (typeof groupIds === 'string') {
          groupIds = [groupIds];
        }
        if (groupIds.length === 0) {
          groupIds.push('ungrouped');
        }
        groupIds.forEach(groupDispatcher.bind(this));

        this.addItem(item, groupIds);
      }
      items.forEach(dispatcher.bind(this));
    }
  }

  removeItems(items) {
    if (items.length) {
      function dispatcher(item) {
        this.dispatch({
          type: 'REMOVE_SLOT',
          data: {
            id: item.jid
          }
        })
      }
      items.forEach(dispatcher.bind(this));
    }
  }

  onStoreChange() {
    // grab the new state
    const newRoster = this.getState().roster;
    // has there been a change?
    if (this.snapshot.all !== newRoster.all) {
      const diff = this.diffRoster(newRoster);
      if (diff.added.length || diff.removed.length) {
        function asyncChanges() {
          this.addItems(diff.added);
          this.removeItems(diff.removed);
        }
        setTimeout(asyncChanges.bind(this), 1);
      }
    }
    this.snapshot = newRoster;
  }
}
