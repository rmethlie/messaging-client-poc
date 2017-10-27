class JID {
  // This is when a user's email id that can be a chat to email contact
  // or an EM account has an apostrophe or other character that is not valid
  // in a JID. We replace it with the corresponding character that the server
  // expects. For now we only start with ' character and we can add later
  //
  // Fixes an issue where an email id has a special character in it
  // @see https://github.com/ThomsonReutersEikon/chat/issues/2286
  static encodeCharactersInJID(jid = "") {
    // for now only do apos (')
    return jid.replace(/'/g, '\\27');
  }

  //Public: Corresponding decode for the encode above since we use the jid
  //as name when we dont have a friendly name or nick name from server or user
  //respectively
  static decodeCharactersInJID(jid = "") {
    return jid.replace(/\\27/g, "'");
  }
}
