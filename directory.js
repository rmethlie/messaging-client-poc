

export default class Directory {
  constructor(connection) {
    this.connection = connection;
  }

  find() {
    return new Promise((resolve, reject) => {
      resolve({
        info: { test: 'test' }
      })
    });
  }
}
