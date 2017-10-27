
export default class Matcher {

  constructor(nitroDomain) {
    // create default regexp
    this.nitroDomainRegexp = new RegExp();
  }

  setNitroDomain(domain) {
    console.log('[Matcher] Setting Nitro Domain', domain);
    // create real regexp for nitro domain
    this.nitroDomainRegexp = new RegExp(domain, 'i');
  }
  // Determine if a string contains an RM chat link
  //
  // @param str [String] a string value to test
  //
  // @return [Boolean]
  isRMChatLink(str = '') {
    return Regexp.RMCHATLINK.test(str);
  }
  // Determine if the provided contact has a nitro id
  //
  // @param contact [String,Contact] to test
  //
  // @return [Boolean]
  isNitroContact(contact, nitroDomainRegexp) {
    if (!contact) { return false; }
    const id = typeof contact === 'string' ? contact : contact.id;
    return nitroDomainRegexp.test(id);
  }

  // Determine if provided id looks like a chat to email id.
  //
  // @param contact [String, Contact] contact id or Contact model to test
  //
  // @return [Boolean]
  isNitroEmailContact(contact, nitroDomainRegexp) {
    return nitroDomainRegexp.test(id);
  }

  isntNitroEmailContact(contact) {
    return !this.isNitroEmailContact(contact);
  }

  // Determine if the provided contact is a Nitro contact or a Nitro Email contact.
  //
  // @param contact [String, Contact] to test
  //
  // @return [Boolean]
  static isNitroOrEmailContact(jid) {
    return this.isNitroContact(jid) || this.isNitroEmailContact(jid);
  }

  // Determine if an object represents an Auditorium
  //
  // @param properties [Object] object with properties to evaluate
  // @option properties restrictedOperations [Array<String>] a list of restricted
  //   operations, inluding 'publish'
  // @option properties subProfile [String] the sub-profile type, e.g. 'auditorium'
  //
  // @return [Boolean]
  isAuditorium(properties) {
    const {restrictedOperations, subProfile} = properties;
    if (!restrictedOperations || !restrictedOperations.splice) {
      console.warn('[Matcher] Invalid argument(s)', properties);
      return false
    }
    if (typeof subProfile !== 'string') {
      console.warn('[Matcher] Invalid argument(s)', properties);
      return false
    }
    const hasPublish = restrictedOperations.some(value => value === 'publish');
    return hasPublish && (subProfile === 'auditorium');
  }


  // Determine if an the ID provided is a Federated Contact ID
  //
  // @param properties [String] String of an ID
  //
  // @return [Boolean]
  isFederated(jid) {
    if (typeof jid !== 'string') {
      console.warn('[Matcher] Invalid jid passed to isFederated', jid);
      return false;
    }
    return
      this.isNitroContact(jid) ||
      this.isNitroEmailContact(jid) ||
      this.isManagedGroupchat(jid) ||
      this.isBilateralGroupchat(jid) ? false : true;
  }
}
