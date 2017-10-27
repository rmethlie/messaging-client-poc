export default class Presence {
  constructor({ connection, store }) {
    const { getComponent, eventManager, setPresence } = connection;
    this.dispatch = store.dispatch.bind(store);
    this.getComponent = getComponent.bind(connection, Nitro.PRESENCE);
    this.setPresence = setPresence.bind(connection);
    this.addEventListeners(eventManager);
  }

  addEventListeners(eventManager) {
    eventManager
      .listenTo(
        Nitro.Events.PRESENCE_SELF_UPDATE,
        this.onSelfUpdate.bind(this)
      );
    eventManager
      .listenTo(
        Nitro.Events.PRESENCE_USER_UPDATE,
        this.onUserUpdate.bind(this)
      );
  }

  onSelfUpdate({ xml, json, adapters }) {
    console.log('[PRESENCE] Self Update');
    const {jid, email, presence, status} = adapters.parseXMPPPresence(json);
    this.dispatch({
      type: 'PRESENCE.SET',
      data: {jid, email, presence, status}
    });
  }

  onUserUpdate({ xml, json, adapters }) {
    console.log('[PRESENCE] User Update');
    const {jid, email, presence, status} = adapters.parseXMPPPresence(json);
    this.dispatch({
      type: 'PRESENCE.SET',
      data: {jid, email, presence, status}
    });
  }

  setAvailable() {
    this.setPresence(Nitro.XMPPPresence.AVAILABLE);
  }

  setUnavailable() {
    this.setPresence(Nitro.XMPPPresence.UNAVAILABLE);
  }

};
