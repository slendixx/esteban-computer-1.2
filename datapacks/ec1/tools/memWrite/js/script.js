///////////////////////////////////////////////////////
// UI elements
///////////////////////////////////////////////////////
const form = document.querySelector(".input_container");
const [
  inputN,
  inputSource,
  inputDest,
  inputMemField,
] = document.querySelectorAll(".form_row");
const [output] = document.querySelectorAll(".output");

///////////////////////////////////////////////////////
// Logic
///////////////////////////////////////////////////////
const generate = function (e) {
  e.preventDefault();
  const commandNumber = Number(inputN.value);
  const source = inputSource.value;
  const dest = inputDest.value;
  const field = Number(inputMemField.value);
  let outputCommands = "";
  let command = "";
  for (let addr = 0; addr < commandNumber; addr++) {
    command = "";
    command = `execute if score ${source} matches ${addr} run scoreboard players operation ${addr} ${dest} = ${
      "mbr" + field
    } cpuRegs\n`;
    outputCommands += command;
  }
  output.textContent = outputCommands;
};

///////////////////////////////////////////////////////
// Event listeners
///////////////////////////////////////////////////////
form.addEventListener("submit", generate);
