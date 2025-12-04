// Create terminal
const term = new Terminal({
  cursorBlink: true
});

// Add the fit addon
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

// Open terminal
term.open(document.getElementById("terminal"));

// Fit terminal to container
fitAddon.fit();
window.addEventListener("resize", () => fitAddon.fit());

// Current line buffer
let curr_line = "";

// Display initial prompt
const prompt = () => {
  term.write("\r\n$ ");
};

term.write("welcome to NIRD OS!\r\nWrite 'help' to see the commands available \r\n");
prompt();

// command history
var bash_history=[]
var history_index=0


// Handle key presses
term.onKey(e => {
  const key = e.key;
  const code = e.domEvent.keyCode;

// ENTER
if (code === 13) {
  const cmd = curr_line.trim();
  if (cmd) {
    bash_history.push(cmd);
    history_index = bash_history.length;
  }
  handleCommand(cmd);
  curr_line = "";
  prompt();
  return;
}

// BACKSPACE
if (code === 8) {
  if (curr_line.length > 0) {
    curr_line = curr_line.slice(0, -1);
    term.write("\b \b");
  }
  return;
}

// UP ARROW
if (code === 38) {
  if (history_index > 0) history_index--;
  curr_line = bash_history[history_index] || "";
  redrawLine(curr_line);
  return;
}

// DOWN ARROW
if (code === 40) {
  if (history_index < bash_history.length - 1) history_index++;
  curr_line = bash_history[history_index] || "";
  redrawLine(curr_line);
  return;
}

function redrawLine(text) {
  term.write("\x1b[2K\r$ "); // clear line + show prompt
  term.write(text);
}

  // Printable characters
  if (key.length === 1) {
    curr_line += key;
    term.write(key);
  }
});

// Command handler
function handleCommand(cmd) {
  term.write("\r\n");
  
  if (cmd === "") return;

  if (cmd === "help") {
    cmdHelp();
  } else if (cmd.match(/clear/)) {
    term.clear();

  } else if (cmd.match(/Ni/)) {
    cmdNi();

  } else if (cmd.match(/R/)) {
    cmdR();

  } else if (cmd.match(/D/)){
    cmdD();
  } else {
    term.write(`${cmd}: command not found`);

  }

  term.write("\r\n");
}


function cmdHelp(){
  term.write("Available commands:\r\n - help : show this help\r\n - clear : clear the terminal");
}

function cmdNi(){
  term.write("Inclusive Computer Science :\r\n NIRD operates for more inclusive Computer Science. In an era of structural dependency towards Big Tech such as Windows, the educational system is facing more and more trials : built-in obsolecence, subscription locked products, etc... The NIRD aproach vows to fight for technological autonomy, especialy for educational teams.");
}

function cmdR(){
  term.write("Responsible : \r\n The NIRD aproach promotes a reasoned process when it comes to technology. In a world of constant inovation, we greatlly value data privacy and co-creation. We first and furmost connect teachers with each others, via a Tchap forum, encouraging them to exchange teaching materials and raise awarness amongst managment teams. One of our other bigest mission is to spread Open Source resources. That is why we deploy computers equiped with Linux.");
}
function cmdD(){
  term.write("Durability: \r\n The NIRD aproach is ")
}