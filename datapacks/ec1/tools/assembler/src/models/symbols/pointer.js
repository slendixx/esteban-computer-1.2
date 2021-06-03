const Symbol = require("./symbol");

class Pointer extends Symbol {
  constructor({ address, id }) {
    super({
      type: "pointer",
      address: address,
      id: id,
      value: null,
      toBeResolved: true,
      valueHolderId: null,
    });
  }
}

module.exports = Pointer;
