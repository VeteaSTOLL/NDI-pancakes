var DEBUG = true; // Useless for now

function changeColor(cmd, term) {

    let regex = /color ([a-z])/
    let match = cmd.match(regex)
    let letter = match[1];

    switch (letter) {
        case "a": {
            term.options.theme = {    
                background : '#1e1f1e',
                foreground: '#48D462'
            };
            break;
        } case "b": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#48C1D4'
            };
            break;
        } case "c": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#C5F1CD'
            };
            break;
        } case "d": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#D3A1F7'
            };
            break;
        } case "e": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#f04444ff'
            };
            break;
        } case "f": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#EDC45C'
            };
            break;
        } default: {
            term.write("Invalid Choice.\r\n" + 
                "Syntax: color [a-z]");
            break;
        }
    }

    return;
}

function initStyle(term) {
    term.options.theme = {
        background : '#1e1f1e',
        foreground: '#48D462',
    }
    term.options.fontSize = 15
    term.options.fontWeight = 700

}


/**
 * "neofetch"
 */
function displayTermName(term) {
    term.write(
        "\r\n" +
        "\t $$\\   $$\\ $$$$$$\\ $$$$$$$\\  $$$$$$$\\   \r\n" +
        "\t $$$\\  $$ |\\_$$  _|$$  __$$\\ $$  __$$\\   \r\n" +
        "\t $$$$\\ $$ |  $$ |  $$ |  $$ |$$ |  $$ |     \r\n" +
        "\t $$ $$\\$$ |  $$ |  $$$$$$$  |$$ |  $$ |     \r\n" +
        "\t $$ \\$$$$ |  $$ |  $$  __$$< $$ |  $$ |     \r\n" +
        "\t $$ |\\$$$ |  $$ |  $$ |  $$ |$$ |  $$ |     \r\n" +
        "\t $$ | \\$$ |$$$$$$\\ $$ |  $$ |$$$$$$$  |    \r\n" +
        "\t \\__|  \\__|\\______|\\__|  \\__|\\_______/ \r\n" +
        "\r\n"
    )
}

/**
 * Initialises the terminal at startup/reload
 */
function termInitText(term) {
    displayTermName(term);
}