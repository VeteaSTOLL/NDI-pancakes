// Create terminal
const term = new Terminal({
  cursorBlink: true,
  theme : {
    background : '#1e1f1e',
    foreground: '#48D462',
  }
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

termInitText(); // Texte de bienvenue
term.write(" Write 'help' to see the available commands\r\n");
prompt();

// Handle key presses
term.onKey(e => {
  const key = e.key;
  const code = e.domEvent.keyCode;

  console.log(e)

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

  // F5 Key
  if (code === 116) {
    location.reload();
    return;
  }

  // CTRL + L (clear)
  if (code === 76 && e.domEvent.ctrlKey) {
    term.clear();
    prompt();
    return;
  }
});

// Command handler
function handleCommand(cmd) {
  if (cmd === "") return;

  if (cmd === "help") {
    term.write(formatHelp());
  } else if (cmd === "clear") {
    term.clear();
  } else if (cmd.match(/color/)) {
    changeColor(cmd);
  }
  
  // Useless stuff
  else if (cmd === "neofetch") {
    term.write("\r\n")
    displayTermName();
  } 

  else if (cmd === "reload") {
    location.reload();
  }
  
  // Default answer (cmd not matched)
  else {
    term.write(`\r\n${cmd}: command not found\r\n`);
  }
}

function formatHelp() {
  return "\r\nAvailable commands:\r\n" +
   " - help : show this message\r\n" +
   " - clear : clear the terminal\r\n" +
   " - color [a-f]: changes the color"
}