//TODO:
// Add a new type of syntax error for cases like not writing any tokens after an instruction that takes an argument
// Add a new type of lexical error for cases when a non defined symbol is used as an instruction argument

const tokenize = require("./tokenizer");
const Variable = require("./symbols/variable");
const Pointer = require("./symbols/pointer");
const Label = require("./symbols/label");
const Branch = require("./symbols/branch");

const dictionary = {};
const symbolTable = [];
let tokens = [];

let address = 0;
let directiveExpected = false;
let orgArgExpected = false;
let variableDeclarationExpected = false;
let variableArgExpected = false;
let labelDeclarationExpected = false;
let pointerDeclarationExpected = false;
let pointerArgExpected = false;
let instructionArgExpected = false;
let branchArgExpected = false;
let branchType = "";

const parse = function (sourceFiles) {
  try {
    sourceFiles.forEach((sourceFile) => {
      tokens = tokenize(sourceFile);
      if (process.env.COMMAND_LINE_OPTION_t === "true") console.log(tokens);
      buildSymbolTable(tokens, symbolTable);
      resolveSemantics(symbolTable);
    });
  } catch (error) {
    if (process.env.COMMAND_LINE_OPTION_d === "true") console.log(tokens);
    throw error;
  }

  return symbolTable;
};

const buildSymbolTable = function (tokens) {
  tokens.forEach((token) => {
    determineCase(token);
  });
};
const determineCase = function (token) {
  const tokenFloatValue = parseFloat(token.value);
  const tokenIntValue = parseInt(token.value);

  if (directiveExpected) {
    if (isDirective(token.value)) {
      if (isOrg(token.value)) {
        directiveExpected = false;
        orgArgExpected = true;
      } else {
        address++;
      }
    } else {
      throw new Error(
        `Syntax error at token ${token.i}: expected directive. Got "${token.value}"`
      );
    }
  } else if (orgArgExpected) {
    if (isNumber(tokenIntValue)) {
      if (tokenIntValue > address) {
        address = tokenIntValue;
        orgArgExpected = false;
      } else {
        throw new Error(
          `Pragmatic error at token ${token.i}: Argument passed to .org "${token.value}" is less than current address ${address}`
        );
      }
    } else {
      throw new Error(
        `Syntax error at token ${token.i}: expected numeric constant as org argument. Got "${token.value}"`
      );
    }
  } else if (variableDeclarationExpected) {
    if (!isNumber(tokenIntValue)) {
      if (!isInDictionary(token.value)) {
        variableDeclarationExpected = false;
        variableArgExpected = true;
        symbolTable.push(new Variable({ address: address, id: token.value }));
      } else {
        throw new Error(
          `Lexical error at token ${token.i}: cannot use reserved keyword/operator "${token.value}" as variable identifier`
        );
      }
    } else {
      throw new Error(
        `Syntax error at token ${token.i}: cannot use numeric constant ${token.value} as variable identifier.`
      );
    }
  } else if (variableArgExpected) {
    if (isNumber(tokenIntValue)) {
      variableArgExpected = false;
      symbolTable[symbolTable.length - 1].value = tokenIntValue;
      symbolTable[symbolTable.length - 1].toBeResolved = false;
      address++;
    } else {
      if (!isInDictionary(token.value)) {
        variableArgExpected = false;
        symbolTable[symbolTable.length - 1].valueHolderId = token.value;
        address++;
      } else {
        throw new Error(
          `Syntax error at token ${token.i}: Unexpected value "${token.value}" for variable declaration`
        );
      }
    }
  } else if (labelDeclarationExpected) {
    if (!isNumber(tokenIntValue)) {
      if (!isInDictionary(token.value)) {
        labelDeclarationExpected = false;
        symbolTable.push(new Label({ address: address, id: token.value }));
      } else {
        throw new Error(
          `Lexical error at token ${token.i}: cannot use reserved keyword/operator "${token.value}" as label identifier`
        );
      }
    } else {
      throw new Error(
        `Syntax error at token ${token.i}: cannot use numeric constant "${token.value}" as label identifier`
      );
    }
  } else if (pointerDeclarationExpected) {
    if (!isNumber(tokenIntValue)) {
      if (!isInDictionary(token.value)) {
        pointerDeclarationExpected = false;
        pointerArgExpected = true;
        symbolTable.push(new Pointer({ address: address, id: token.value }));
      } else {
        throw new Error(
          `Lexical error at token ${token.i}: cannot use reserved keyword/operator "${token.value}" as pointer identifier`
        );
      }
    } else {
      throw new Error(
        `Syntax error at token ${token.i}: cannot use numeric constant "${token.value}" as pointer identifier`
      );
    }
  } else if (pointerArgExpected) {
    if (!isNumber(tokenIntValue)) {
      if (!isInDictionary(token.value)) {
        pointerArgExpected = false;
        symbolTable[symbolTable.length - 1].valueHolderId = token.value;
        address++;
      } else {
        throw new Error(
          `Lexical error at token ${token.i}: cannot use reserved keyword/operator "${token.value}" as pointer argument`
        );
      }
    } else {
      throw new Error(
        `Syntax error at token ${token.i}: cannot use numeric constant "${token.value}" as pointer argument`
      );
    }
  } else if (instructionArgExpected) {
    if (isNumber(tokenIntValue)) {
      instructionArgExpected = false;
      address++;
    } else {
      if (!isInDictionary(token.value)) {
        instructionArgExpected = false;
        address++;
      } else {
        throw new Error(
          `Lexical error at token ${token.i}: cannot use reserved keyword/operator "${token.value}" as instruction argument`
        );
      }
    }
  } else if (branchArgExpected) {
    if (isNumber(tokenIntValue)) {
      branchArgExpected = false;
      symbolTable.push(
        new Branch({
          address: address,
          value: tokenIntValue,
          valueHolderId: null,
          branchType: branchType,
        })
      );
      branchType = "";
      address++;
    } else {
      if (!isInDictionary(token.value)) {
        branchArgExpected = false;
        symbolTable.push(
          new Branch({
            address: address,
            valueHolderId: token.value,
            value: null,
            branchType: branchType,
          })
        );
        branchType = "";
        address++;
      } else {
        throw new Error(
          `Lexical error at token ${token.i}: cannot use reserved keyword/operator "${token.value}" as branch argument`
        );
      }
    }
  } else if (token.value === ";") {
    directiveExpected = true;
  } else if (token.value === "$") {
    variableDeclarationExpected = true;
  } else if (token.value === ":") {
    labelDeclarationExpected = true;
  } else if (token.value === "#") {
    pointerDeclarationExpected = true;
  } else if (isSingleArgInstruction(token.value)) {
    if (isBranchInstruction(token.value)) {
      branchArgExpected = true;
      branchType = token.value;
    } else {
      instructionArgExpected = true;
    }
  } else if (isNoArgInstruction(token.value)) {
    address++;
  } else {
    throw new Error(`Unknown token at token ${token.i}: "${token.value}"`);
  }

  // console.log(
  //   `token: ${token}, instructionArgExpected: ${instructionArgExpected}`
  // );
};

const isOperator = function (token) {
  return module.exports.dictionary.operators.some((op) => op === token);
};

const isDirective = function (token) {
  return module.exports.dictionary.directives.some((dir) => dir === token);
};

const isOrg = function (token) {
  return token === "org";
};

const isNumber = function (token) {
  const reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
  return reg.test(token);
};

const isSingleArgInstruction = function (token) {
  return module.exports.dictionary.singleArgInstructions.some(
    (inst) => inst === token
  );
};

const isBranchInstruction = function (token) {
  return module.exports.dictionary.branchInstructions.some(
    (inst) => inst === token
  );
};

const isNoArgInstruction = function (token) {
  return module.exports.dictionary.noArgInstructions.some(
    (inst) => inst === token
  );
};

const isInDictionary = function (token) {
  const operator = isOperator(token);
  const directive = isDirective(token);
  const singleArgInstruction = isSingleArgInstruction(token);
  const noArgInstruction = isNoArgInstruction(token);

  return operator || directive || noArgInstruction || singleArgInstruction;
};

const resolveSemantics = function (symbolTable) {
  resolveVariableSemantics(symbolTable);
  resolvePointerSemantics(symbolTable);
  resolveBranchSemantics(symbolTable);
};

const resolveVariableSemantics = function (symbolTable) {
  symbolTable.forEach((symbol) => {
    if (isVariable(symbol)) {
      if (symbol.toBeResolved) {
        const valueHolderId = symbol.valueHolderId;
        const valueHolder = symbolTable.find(
          (symbol) => symbol.id === valueHolderId
        );
        if (valueHolder !== undefined) {
          if (!isLabel(valueHolder)) {
            symbol.toBeResolved = false;
            symbol.value = valueHolder.value;
          } else {
            throw new Error(
              `Semantic error: cannot assign label "${valueHolderId}" as variable value`
            );
          }
        } else {
          throw new Error(
            `Pragmatic error: undefined symbol "${valueHolderId}"`
          );
        }
      }
    }
  });
};
const resolvePointerSemantics = function (symbolTable) {
  symbolTable.forEach((symbol) => {
    if (isPointer(symbol)) {
      const valueHolderId = symbol.valueHolderId;
      const valueHolder = symbolTable.find(
        (symbol) => symbol.id === valueHolderId
      );
      if (valueHolder !== undefined) {
        symbol.toBeResolved = false;
        symbol.value = valueHolder.address;
      } else {
        throw new Error(`Pragmatic error: undefined symbol "${valueHolderId}"`);
      }
    }
  });
};
const resolveBranchSemantics = function (symbolTable) {
  symbolTable.forEach((symbol) => {
    if (isBranch(symbol)) {
      if (symbol.toBeResolved) {
        const valueHolderId = symbol.valueHolderId;
        const valueHolder = symbolTable.find(
          (symbol) => symbol.id === valueHolderId
        );
        if (valueHolder !== undefined) {
          if (isLabel(valueHolder)) {
            symbol.toBeResolved = false;
            symbol.value = valueHolder.address - symbol.address;
          } else {
            throw new Error(
              `Semantic error: cannot assign non label symbol "${valueHolderId}" as branch value`
            );
          }
        } else {
          throw new Error(
            `Pragmatic error: undefined symbol "${valueHolderId}"`
          );
        }
      }
    }
  });
};

const isVariable = function (symbol) {
  return symbol.type === "variable";
};
const isLabel = function (symbol) {
  return symbol.type === "label";
};
const isPointer = function (symbol) {
  return symbol.type === "pointer";
};
const isBranch = function (symbol) {
  return symbol.type === "branch";
};

module.exports.dictionary = dictionary;
module.exports.parse = parse;
