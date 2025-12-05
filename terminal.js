import { dialogue } from "3D";
var on_tuto = false;

const TerminalStates = {
  DEFAULT: "",
  HUBERT: "hubert"
};


// Create terminal
export const term = new Terminal({
  cursorBlink: true,
  theme : {
    background : '#1e1f1e',
    foreground: '#48D462',
  }
});

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
      if(on_tuto===true){
        tuto(cmd);
      } else {
        handleCommand(cmd);
      }
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
    writeAndTTS(formatHelp());
  } else if (cmd.match(/clear/)) {
    term.clear();

  } else if (cmd.match(/Ni/)) {
    cmdNi();

  } else if (cmd.match(/R/)) {
    cmdR();

  } else if (cmd.match(/D/)){
    cmdD();
  } else if (cmd.match(/color/)) {
    changeColor(cmd, term);
  } else if (cmd.match(/tuto/)){
    on_tuto = true;
    
    writeAndTTS("You wake up in an area that tells you nothing at first sight.\r\nBut after more ample inspection, you realize that you are in a terminal, a tool in which you can perform actions using commands.\r\nOpen your adventurer’s manual with the manual command.")
    tuto(cmd);
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
    // <script src="termialCommands.js"></script>

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
   " - color [a-f]: changes the color\r\n" +
   " - Ni : infos about NIRD's Inclusiveness\r\n"+
   " - R : infos about NIRD's Responsible process\r\n"+
   " - D : infos about NIRD's Durability\r\n"+
   " - neofetch : informations on the terminal\r\n"
}

function handleCommandHubert(cmd) {
  if (cmd === "") return;

  console.log(cmd);
  // Envoie du prompt à l'IA
  if (cmd === "exit") {
    terminalState = TerminalStates.DEFAULT;
  }
}

function tuto(cmd){
  
  
  if (cmd === "manual"){
  writeAndTTS("\r\nManual:\r\n"+
    "pwd → know where you are\r\n"+
    "they → look at the visible destinations\r\n"+
    "mkdir → create a tidy\r\n"+
    "cp [source] [destination] → copy an object\r\n"+
    "mv → move/rename\r\n"+
    "rm → delete\r\n");
    writeAndTTS("But where are you? Use a command to find out.\r\n");
  }
  if ( cmd === "pwd"){
    writeAndTTS("You should look around!\r\n")
  }
    if ( cmd === "ls"){
    writeAndTTS("Create an inventory to store your things.\r\n")
  }
  if (cmd === "mkdir inventory"){
    writeAndTTS("You find a treasure map on the ground. Copy it into your notes!\r\n");
  }
  if ( cmd === "cp map inventory/map"){
    writeAndTTS("You remember that you have a purse in your pocket. You want to move it to your inventory.\r\n")
  }
  if ( cmd === "mv purse/inventory"){
    writeAndTTS("Attention! A cursed file named \"malediction\" in your inventory. Delete it!\r\n")
  }
  if (cmd === "rm inventaire/malediction"){
    writeAndTTS("Congratulations ! You finished the tutorial !\r\n"); 
    
  }
}
