const TerminalStates = {
  DEFAULT: "",
  HUBERT: "hubert"
};


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

// Current terminal state
let terminalState = "";

// Display initial prompt
const prompt = () => {
  if (terminalState === TerminalStates.HUBERT) {
    term.write("\r\n🦖  ");
  } else {
    term.write("\r\n$ ");
  }
};

term.write(" Write 'help' to see the commands available \r\n");
prompt();

// Handle key presses
term.onKey(e => {
  const key = e.key;
  const code = e.domEvent.keyCode;

  // ENTER
  if (code === 13) {
    if (terminalState === TerminalStates.HUBERT) {
      handleCommandHubert(curr_line.trim());
    } else {
      handleCommand(curr_line.trim());
    }
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

  // Printable characters
  if (key.length === 1) {
    curr_line += key;
    term.write(key);
  }
});

// Command handler
function handleCommand(cmd) {
  if (cmd === "") return;

  if (cmd === "help") {
    term.write("\r\nAvailable commands:\r\n - help : show this help\r\n - clear : clear the terminal\r\n");
  } else if (cmd === "clear") {
    term.clear();
  } else if (cmd === "hubert") {
    // Message d'aide
    term.write("\r\n enter \"exit\" to quit hubert")

    // Change l'état du terminal en mode hubert
    terminalState = TerminalStates.HUBERT;
  } else {
    term.write(`\r\n${cmd}: command not found\r\n`);
  }
}

function handleCommandHubert(cmd) {
  if (cmd === "") return;

  console.log(cmd);
  // Envoie du prompt à l'IA
  if (cmd === "exit") {
    terminalState = TerminalStates.DEFAULT;
  }
}
