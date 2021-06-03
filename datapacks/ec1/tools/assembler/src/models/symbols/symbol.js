class Symbol {
  constructor({ type, address, id, value, toBeResolved, valueHolderId }) {
    this.type = type;
    this.address = address;
    this.id = id;
    this.value = value;
    this.toBeResolved = toBeResolved;
    this.valueHolderId = valueHolderId;
  }
}

module.exports = Symbol;
