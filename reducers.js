import Connection from './connection.js';
import Matcher from './matcher.js';
import User from './user.js';
import Directory from './directory.js';

// reducers/middleware
import connection from './connection.reducer.js';
import connectionMiddleware from './connection.middleware.js';
import authentication from './authentication.reducer.js';
import authenticationMiddleware from './authentication.middleware.js';
import containers from './containers.reducer.js';
import containersMiddleware from './containers.middleware.js';
import roster from './roster.reducer.js';
import rosterMiddleware from './roster.middleware.js';
import presence from './presence.reducer.js';
import conversations from './conversations.reducer.js';
import conversationsMiddleware from './conversations.middleware.js';
import editor from './editor.reducer.js';
import editorMiddleware from './editor.middleware.js';
import ui from './ui.reducer.js';


export default {
  connection,
  connectionMiddleware,
  authentication,
  authenticationMiddleware,
  containers,
  containersMiddleware,
  roster,
  rosterMiddleware,
  presence,
  conversations,
  conversationsMiddleware,
  editor,
  editorMiddleware,
  ui
}
