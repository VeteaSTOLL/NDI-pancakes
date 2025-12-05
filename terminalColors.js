import { changeDinoColor } from "./3D.js"; 

export function changeColor(cmd, term) {

    let regex = /color ([a-z])/
    let match = cmd.match(regex)
    let letter = match[1];

    switch (letter) {
        case "a": {
            term.options.theme = {    
                background : '#1e1f1e',
                foreground: '#48D462'
            };
            changeDinoColor(0x48D462);
            break;
        } case "b": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#48C1D4'
            };
            changeDinoColor(0x48C1D4);
            break;
        } case "c": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#4864D4'
            };
            changeDinoColor(0x4864D4);
            break;
        } case "d": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#B25CED'
            };
            changeDinoColor(0xB25CED);
            break;
        } case "e": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#ED5C5C'
            };
            changeDinoColor(0xED5C5C);
            break;
        } case "f": {
            term.options.theme = {
                background : '#1e1f1e',
                foreground: '#EDC45C'
            };
            changeDinoColor(0xEDC45C);
            break;
        } default: {
            term.write("\r\nInvalid Choice.\r\n" + 
                "Syntax: color [a-z]");
            break;
        }
    }

    return;
}

export function initStyle(term) {
    term.options.theme = {
        background : '#1e1f1e',
        foreground: '#48D462',
    }
}


/**
 * "neofetch"
 */
export function displayTermName(term) {
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
export function termInitText(term) {
    displayTermName(term);
}