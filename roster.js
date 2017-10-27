import RosterUIManager from './roster-ui-manager.js';
export default class Roster {
  constructor({ connection, store }) {
    const { getComponent, eventManager } = connection;
    this.dispatch = store.dispatch.bind(store);
    this.getComponent = getComponent.bind(connection, Nitro.ROSTER);
    this.rosterUI = new RosterUIManager();
    this.addEventListeners(eventManager);
  }

  addEventListeners(eventManager) {

  }

  load() {
    this.getComponent()
      .getRoster()
      .then(this.parseRoster.bind(this))
      .then(this.storeRoster.bind(this));
  }

  parseContact(contact) {
    // group is an array of group ids
    // attributes is the jid and other contact info
    const {group, attributes} = contact;
    // remap the reference for readability (or normalization)
    const groupIds = group || [];
    // read the rest of the attributes
    const { jid, name, email, company, subscription } = attributes;
    // return a raw (unformatted) contact object
    return Object.assign({}, { jid, name, email, company, groupIds });
  }

  formatContact(contact) {
    let {
      jid = '',
      name = '',
      email = '',
      company = '',
      groupIds = []
    } = contact;

    if (Matchers.isNitroEmailContact(jid) || Matchers.isFederated(jid)) {
      if (Matchers.isNitroEmailContact(jid)) {
        //For email contacts, decode special chars that may be jid may
        //contain special chars that appear encoded.
        //@see https://github.com/ThomsonReutersEikon/chat/issues/2286
        cleanJID = JID.decodeCharactersInJID(jid);
        //Turn the cleaned JID into a valid email address
        email = cleanJID.replace(/@.*/, "").replace("..", "@").replace(/\\27/g, "'")
      } else {
        email = jid
      }

      //If the jid and name fields are identical or if the name field isn't
      //provided that means no nickname has been set and we should use the
      //email for both the name and nickname
      if ((jid === name) || !name) {
        name = email
        nickname = email
      } else {
        nickname = name
      }
    } else {
      if (name) {
        split = name.split(' - ')
      } else {
        //Need to decode this, same reason cited, above.
        //@see https://github.com/ThomsonReutersEikon/chat/issues/2286
        split = EM.Utils.decodeCharactersInJID(jid);
        split = split.split('@');
      }
      //Use the company, if provided, or try to extract it from the name.
      company_name = company || split[1].trim();

      //After taking the first name, we are assuming that the first word is the
      //first name and everything else is the last name, for sorting purposes.
      full_name = split[0].trim();
      nickname = full_name;
      name = full_name;
      first_name = full_name.split(" ")[0];
      last_name = full_name.slice(first_name.length + 1);
      domain = Strophe.getDomainFromJid(jid);

    }

    //Return attributes object
    return {
      id: jid,
      domain: domain,
      name: name,
      first_name: first_name,
      last_name: last_name,
      nickname: nickname,
      company: company_name,
      provider: provider,
      profile: EM.ENUM.RCS_PROFILE_IM,
      email: email,
      groupIds: groupIds,
      inRoster: true
    }
  }

  parseRoster(data) {
    console.log('[Roster] Parsing roster', data.json);
    const { xml, json, adapters } = data;
    const items = json.query.item || [];
    function contactMapper(item) {
      let jid = adapters.getBareJID(item.attributes.jid);
      // Filter out any bad data, e.g. groupchat ids (known issue for some
      // QA testing accounts).
      if (Nitro.utils.isGroupchat(jid)) {
        console.warn("[NitroRoster] Received a contact without a proper JID");
        return null;
      }
      return this.parseContact(item);
    }
    const contacts = items.map(contactMapper.bind(this)).filter(item => !!item);

    //Create new groups (if not already in the application) for all contact
    //group memberships
    // this.createNewGroups(this.extractGroupIds(contacts));

    return contacts;

  }

  storeRoster(roster) {
    console.log('[Roster] Storing', roster.length, 'items');
    this.dispatch({
      type: 'API.ROSTER.SET',
      data: roster
    });
  }
}
