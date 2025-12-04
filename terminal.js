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

term.write(" Write 'help' to see the commands available \r\n");
prompt();

// Handle key presses
term.onKey(e => {
  const key = e.key;
  const code = e.domEvent.keyCode;

  // ENTER
  if (code === 13) {
    handleCommand(curr_line.trim());
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
  } else {
    term.write(`\r\n${cmd}: command not found\r\n`);
  }
}
