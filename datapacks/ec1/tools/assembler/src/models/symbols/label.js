const Symbol = require("./symbol");

class Label extends Symbol {
  constructor({ address, id }) {
    super({
      type: "label",
      address: address,
      id: id,
      value: null,
      toBeResolved: false,
      valueHolderId: null,
    });
  }
}

module.exports = Label;
