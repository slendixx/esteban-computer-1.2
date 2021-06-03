const tokenize = require("./tokenizer");

const machineCodelines = [];
const dictionary = {};

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

const translate = function ({ symbolTable, sourceFiles, opcodes }) {
  try {
    sourceFiles.forEach((sourceFile) => {
      const tokens = tokenize(sourceFile);

      synthesizeMachineCode({ tokens, symbolTable, opcodes });
    });
  } catch (error) {
    throw error;
  }

  return machineCodelines;
};

const synthesizeMachineCode = function ({ tokens, symbolTable, opcodes }) {
  tokens.forEach((token) => {
    determineCase({ token, symbolTable, opcodes });
  });
};

const determineCase = function ({ token, symbolTable, opcodes }) {
  if (directiveExpected) {
    if (isOrg(token.value)) {
      directiveExpected = false;
      orgArgExpected = true;
    } else address++;
  } else if (orgArgExpected) {
    orgArgExpected = false;
    address = parseInt(token.value);
  } else if (variableDeclarationExpected) {
    variableDeclarationExpected = false;
    variableArgExpected = true;
    synthesizeVariable({ token, symbolTable, address });
  } else if (variableArgExpected) {
    variableArgExpected = false;
    address++;
  } else if (labelDeclarationExpected) {
    labelDeclarationExpected = false;
  } else if (pointerDeclarationExpected) {
    pointerDeclarationExpected = false;
    pointerArgExpected = true;
    synthesizePointer({ token, symbolTable, address });
  } else if (pointerArgExpected) {
    pointerArgExpected = false;
    address++;
  } else if (instructionArgExpected) {
    instructionArgExpected = false;
    setInstructionArg({ token, symbolTable });
    address++;
  } else if (branchArgExpected) {
    branchArgExpected = false;
    setBranchArg({ token, symbolTable, address });
    address++;
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
      synthesizeBranchInstruction({ token, symbolTable, address, opcodes });
    } else {
      instructionArgExpected = true;
      synthesizeSingleArgInstruction({ token, symbolTable, address, opcodes });
    }
  } else if (isNoArgInstruction(token.value)) {
    synthesizeNoArgInstruction({ token, symbolTable, address, opcodes });
    address++;
  } else {
    throw new Error(
      `Pragmatic error at token ${token.i}: Unexpected token "${token.value}" found during synthesis phase`
    );
  }
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

const synthesizeBranchInstruction = function ({
  token,
  symbolTable,
  address,
  opcodes,
}) {
  const opcode = getOpcode({ token, opcodes });
  const mem1 = `scoreboard players set ${address} mem1 ${opcode}`;
  const mem2 = `scoreboard players set ${address} mem2 %BRANCH_ARG%`;
  machineCodelines.push(formatMemSections(mem1, mem2));
};
const synthesizeNoArgInstruction = function ({
  token,
  symbolTable,
  address,
  opcodes,
}) {
  const opcode = getOpcode({ token, opcodes });
  const mem1 = `scoreboard players set ${address} mem1 ${opcode}`;
  const mem2 = `scoreboard players set ${address} mem2 0`;
  machineCodelines.push(formatMemSections(mem1, mem2));
};
const synthesizePointer = function ({ token, symbolTable, address }) {
  const symbol = getSymbol({ token, symbolTable });
  const mem1 = `scoreboard players set ${address} mem1 0`;
  const mem2 = `scoreboard players set ${address} mem2 ${symbol.value}`;
  machineCodelines.push(formatMemSections(mem1, mem2));
};
const synthesizeSingleArgInstruction = function ({
  token,
  symbolTable,
  address,
  opcodes,
}) {
  const opcode = getOpcode({ token, opcodes });
  const mem1 = `scoreboard players set ${address} mem1 ${opcode}`;
  const mem2 = `scoreboard players set ${address} mem2 %INSTRUCTION_ARG%`;
  machineCodelines.push(formatMemSections(mem1, mem2));
};
const synthesizeVariable = function ({ token, symbolTable, address }) {
  const symbol = getSymbol({ token, symbolTable });
  const mem1 = `scoreboard players set ${address} mem1 0`;
  const mem2 = `scoreboard players set ${address} mem2 ${symbol.value}`;
  machineCodelines.push(formatMemSections(mem1, mem2));
};

const formatMemSections = function (mem1, mem2) {
  return mem1 + "\n" + mem2;
};

const getSymbol = function ({ token, symbolTable }) {
  return symbolTable.find((symbol) => {
    return symbol.id === token.value;
  });
};

const getOpcode = function ({ token, opcodes }) {
  return opcodes.find((instruction) => {
    return instruction.nemonic === token.value;
  }).opcode;
};

const setBranchArg = function ({ token, symbolTable, address }) {
  if (isNumber(token.value))
    machineCodelines[machineCodelines.length - 1] = machineCodelines[
      machineCodelines.length - 1
    ].replace("%BRANCH_ARG%", "" + token.value);
  else {
    const symbol = getSymbol({ token, symbolTable }); //token is a label so we can use to get the label address
    const branchArg = symbol.address - address; //calculate the jump size
    machineCodelines[machineCodelines.length - 1] = machineCodelines[
      machineCodelines.length - 1
    ].replace("%BRANCH_ARG%", "" + branchArg);
  }
};

const setInstructionArg = function ({ token, symbolTable }) {
  if (isNumber(token.value))
    machineCodelines[machineCodelines.length - 1] = machineCodelines[
      machineCodelines.length - 1
    ].replace("%INSTRUCTION_ARG%", "" + token.value);
  else {
    const symbol = getSymbol({ token, symbolTable });
    machineCodelines[machineCodelines.length - 1] = machineCodelines[
      machineCodelines.length - 1
    ].replace("%INSTRUCTION_ARG%", "" + symbol.value);
  }
};

module.exports.translate = translate;
module.exports.dictionary = dictionary;
