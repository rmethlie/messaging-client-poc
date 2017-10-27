
const Regexp = {
  IP_ADDRESS: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  // Managed or Bilateral XMPP groupchat JID
  CHATROOM_JID: /@(conference|legacychat)\./i,

  // Managed chatroom JID
  MANAGED_CHATROOM_JID: /@legacychat\./i,

  // RM Chatroom Link
  RMCHATLINK: /rmchat\:/i,

  // Yahoo id
  YAHOO_ID: /.*@(yahoo|rocketmail|ymail)\.co/
}
