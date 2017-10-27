
window.params = {};
document.location.search
  .replace(/^\?/, '')
  .split('&')
  .reduce((params, param) => {
    const keyVal = param.split('=');
    params[keyVal[0]] = keyVal.length === 2 ?
      keyVal[1] : true;
    return params;
  }, window.params);
