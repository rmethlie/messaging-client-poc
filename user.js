

export default class User {

  get credentials() {
    return this._credentials;
  }
  set credentials(credentials) {
    this._credentials = credentials;
  }

  get jid() {
    return this._credentials.jid;
  }
  set jid(jid) {
    this._credentials.jid = jid;
  }

  get bareJID() {
    return Strophe.getBareJidFromJid(this.jid);
  }

  get password() {
    return this._credentials.password;
  }
  set password(password) {
    this._credentials.password = password;
  }

  normalize(userData) {
    const { jid, password, profile } = Object.assign({}, userData);
    return {
      jid,
      password
    };
  }

  constructor(user) {
    this._credentials = this.normalize(user);
  }

}
