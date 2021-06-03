// TODO:

// *** Command line options ***
// -t display tokens for each source file
// -d display tokens only for source files that caused errors
// -s display symbol table after parsing
// -o specify name for the output file
// -h display list of options

const fs = require("fs");
const dotenv = require("dotenv");
const parser = require("./src/models/parser");
const translator = require("./src/models/translator");

dotenv.config({ path: "./config.env" });

const parseCommandLineOptions = function (commandLineArgs) {
  commandLineArgs.forEach((arg) => {
    if (arg === "-t") process.env.COMMAND_LINE_OPTION_t = true;
    if (arg === "-d") process.env.COMMAND_LINE_OPTION_d = true;
    if (arg === "-s") process.env.COMMAND_LINE_OPTION_s = true;
    if (arg === "-o") process.env.COMMAND_LINE_OPTION_o = true;
    if (arg === "-h") process.env.COMMAND_LINE_OPTION_h = true;
  });
};
const removeCommandLineOptions = function (commandLineArgs) {
  return commandLineArgs.filter((arg) => {
    return !process.env.COMMAND_LINE_OPTIONS.includes(arg);
  });
};
const displaySymbolTable = function (symbolTable) {
  symbolTable.forEach((symbol, index) => {
    console.log(`${index + 1}: ${symbol.type}{
      address: ${symbol.address},
      id: ${symbol.id},
      value: ${symbol.value}${
      symbol.type === "branch" ? ",\n\tbranch type: " + symbol.branchType : ""
    }
    }`);
  });
};
const formatOutputFilePath = function (outputFileName) {
  return process.env.COMPILE_PATH + outputFileName;
};

const commandLineArgs = process.argv.slice(2);

parseCommandLineOptions(commandLineArgs);

if (process.env.COMMAND_LINE_OPTION_h === "true") {
  console.log(`
*** Command line options ***
  -t display tokens for each source file
  -d display tokens only for source files that caused errors
  -s display symbol table after parsing
  -o specify name for the output file
  -h display list of options
  `);
  return;
}

//handle -o command line option
let commandLineArgsWithoutOutputFileName, outputFileName;
if (process.env.COMMAND_LINE_OPTION_o === "true") {
  commandLineArgsWithoutOutputFileName = commandLineArgs.slice(
    0,
    commandLineArgs.indexOf("-o")
  );
  outputFileName = commandLineArgs.slice(commandLineArgs.indexOf("-o") + 1)[0];
} else {
  commandLineArgsWithoutOutputFileName = commandLineArgs;
  outputFileName = process.env.DEFAULT_OUTPUT_FILE_NAME;
}

outputFilePath = formatOutputFilePath(outputFileName);

sourceFilePaths = removeCommandLineOptions(
  commandLineArgsWithoutOutputFileName
);

//Read source files
let sourceFiles;
try {
  sourceFiles = sourceFilePaths.map((arg) =>
    fs.readFileSync(`${arg}`, "utf-8")
  );
} catch (error) {
  console.error(`Error: Could not find source file '${error.path}'`);
  process.exit();
}

//Read instruction dictionary and opcodes from disk
const dictionary = fs.readFileSync("./data/dictionary.json", "utf-8");
parser.dictionary = JSON.parse(dictionary);

const opcodes = JSON.parse(fs.readFileSync("./data/opcodes.json", "utf-8"));

translator.dictionary = JSON.parse(dictionary);

//translate to machine code
let symbolTable;
let machineCodeLines;
try {
  symbolTable = parser.parse(sourceFiles);
  machineCodeLines = translator.translate({
    symbolTable: symbolTable,
    sourceFiles: sourceFiles,
    opcodes: opcodes,
  });
} catch (error) {
  console.error(error);
}

//handle -s command line option
if (process.env.COMMAND_LINE_OPTION_s === "true")
  displaySymbolTable(symbolTable);

//write to output file
fs.writeFileSync(outputFilePath, machineCodeLines.join("\n"), "utf-8");
