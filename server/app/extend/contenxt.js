const UA = Symbol('Context#ua');
const useragent = require('useragent');

module.exports = {
  get ua() {
    if (!this[UA]) {
      const uaString = this.get('user-agent');
      this[UA] = useragent.parse(uaString);
    }
    return this[UA];
  },
};
