
// ip address
export const re_IP_ADDRESS = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
// Managed or Bilateral XMPP groupchat JID
export const re_CHATROOM_JID = /@(conference|legacychat)\./i;

// Managed chatroom JID
export const re_MANAGED_CHATROOM_JID = /@legacychat\./i;

// RM Chatroom Link
export const re_RMCHATLINK = /rmchat\:/i;

// Yahoo id
export const re_YAHOO_ID = /.*@(yahoo|rocketmail|ymail)\.co/;

// Email
export const re_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
