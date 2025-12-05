import { dialogue, displayMusic } from "3D";
import { changeColor, termInitText, displayTermName, initStyle } from "./terminalColors.js";

const TerminalStates = {
  DEFAULT: "",
  HUBERT: "hubert"
};


// Create terminal
export const term = new Terminal({
  cursorBlink: true,
});

initStyle(term);

function writeAndTTS(str) {
  term.write(str);
  dialogue(str);
}

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

termInitText(term); // Texte de bienvenue
writeAndTTS(" Write 'help' to see the available commands\r\n");
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
  if (cmd != "") {
    bash_history.push(cmd);
    history_index = bash_history.length;

    if (terminalState === TerminalStates.HUBERT) {
      handleCommandHubert(cmd);
    } else {
      handleCommand(cmd);
    }
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
  writeAndTTS(text);
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
  term.write("\r\n");
  
  if (cmd === "") return;

  if (cmd === "help") {
    cmdHelp();

  } else if (cmd.match(/clear/)) {
    term.clear();

  } else if (cmd.match(/Ni/)) {
    cmdNi();

  } else if (cmd.match(/music/)) {
    // Musique : "On & On" par Cartoon [NCS Release]
    displayMusic("res/unity.mp3");
  }else if (cmd.match(/R/)) {
    cmdR();

  } else if (cmd.match(/D/)){
    cmdD();
  } else if (cmd.match(/color/)) {
    changeColor(cmd, term);

  } else if (cmd === "hubert") {
    // Message d'aide
    writeAndTTS("\r\n enter \"exit\" to quit hubert")

    // Change l'état du terminal en mode hubert
    terminalState = TerminalStates.HUBERT;
  }
  
  // Useless stuff
  else if (cmd === "neofetch") {
    term.write("\r\n")
    displayTermName(term);
  } 

  else if (cmd === "reload") {
    location.reload();
  }
  
  // Default answer (cmd not matched)
  else {
    writeAndTTS(`${cmd}: command not found`);

    writeAndTTS(formatHelp());
  } 

  term.write("\r\n");
}


function cmdHelp(){
  writeAndTTS(formatHelp());
}

function cmdNi(){
  writeAndTTS("Inclusive Computer Science :\r\n NIRD operates for more inclusive Computer Science. In an era of structural dependency towards Big Tech such as Windows, the educational system is facing more and more trials : built-in obsolecence, subscription locked products, etc... The NIRD aproach vows to fight for technological autonomy, especialy for educational teams.");
}

function cmdR(){
  writeAndTTS("Responsible : \r\n The NIRD aproach promotes a reasoned process when it comes to technology. In a world of constant inovation, we greatlly value data privacy and co-creation. We first and furmost connect teachers with each others, via a Tchap forum, encouraging them to exchange teaching materials and raise awarness amongst managment teams. One of our other bigest mission is to spread Open Source resources. That is why we deploy computers equiped with Linux.");
}
function cmdD(){
  writeAndTTS("Durability: \r\n The NIRD aproach is ")
}

function formatHelp() {
  return "\r\nAvailable commands:\r\n" +
   " - help : show this message\r\n" +
   " - clear : clear the terminal\r\n" +
   " - music : play some music\r\n" +
   " - color [a-f]: changes the color [green, lightBlue, white-ish, mauve, red, gold]\r\n" +
   " - Ni\r\n" +
   " - R\r\n" +
   " - D\r\n"
}

function handleCommandHubert(cmd) {
  if (cmd === "") return;

  console.log(cmd);
  // Envoie du prompt à l'IA
  if (cmd === "exit") {
    terminalState = TerminalStates.DEFAULT;
  }
}
