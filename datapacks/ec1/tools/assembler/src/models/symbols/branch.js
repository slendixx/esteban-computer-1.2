const Symbol = require("./symbol");

class Branch extends Symbol {
  constructor({ address, valueHolderId, value, branchType }) {
    super({
      type: "branch",
      address: address,
      id: null,
      value: value,
      toBeResolved: valueHolderId !== null ? true : false,
      valueHolderId: valueHolderId,
    });
    this.branchType = branchType;
  }
}

module.exports = Branch;
