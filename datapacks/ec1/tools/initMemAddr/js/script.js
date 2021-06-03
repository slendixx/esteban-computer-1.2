///////////////////////////////////////////////////////
// UI elements
///////////////////////////////////////////////////////
const [inputN, btnGenerate] = document.querySelectorAll(".input");
const [output] = document.querySelectorAll(".output");

///////////////////////////////////////////////////////
// Logic
///////////////////////////////////////////////////////
const generate = function () {
  const commandNumber = Number(inputN.value);
  let outputCommands = "";
  let command = "";
  for (let addr = 0; addr < commandNumber; addr++) {
    command = "";
    command = `scoreboard players add ${addr} callStack1 0\n`;
    outputCommands += command;
  }
  output.textContent = outputCommands;
};

///////////////////////////////////////////////////////
// Event listeners
///////////////////////////////////////////////////////
btnGenerate.addEventListener("click", generate);

// command = "";
// command = `scoreboard players add ${addr} m0 ${addr}\n`;
// outputCommands += command;
// command = `scoreboard players add ${addr} m1 0\n`;
// outputCommands += command;
// command = `scoreboard players add ${addr} m2 0\n`;
// outputCommands += command;

// command = "";
// command = `execute if score mar reg matches ${addr} run scoreboard players operation ${addr} m1 = r reg\n`;
// outputCommands += command;
