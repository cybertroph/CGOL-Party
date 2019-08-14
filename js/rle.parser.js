function textToMatrix(text) {
    text = text.replace(/(\r\n|\n|\r)/gm, "");
    text = text.toLowerCase();
    if (text.charAt(text.length - 1) === '!') {
        text = text.substring(0, text.length - 1);
    }
    const decodedText = decodeRLE(text);
    const splits = decodedText.split("$");
    const cols = [];

    let maxWidth = 0;
    for (let i = 0 ; i < splits.length ; i++) {
        if (splits.length > maxWidth) {
            maxWidth = splits.length+1;
        }
    }

    for (let i = 0 ; i < splits.length ; i++) {
        cols[i] = fillRow(splits[i]);
    }

    function fillRow(str) {
        let decoded = str;
        decoded = decoded.replace(/b/g, 0);
        decoded = decoded.replace(/o/g, 1);
        
        const row = [];
        for (let i = 0 ; i < maxWidth ; i++) {
            if (i < decoded.length) {
                row.push(parseInt(decoded[i], 10));
            } else {
                row.push(0);
            }
        }
        return row;
    }    
    return cols;
}

function encodeRLE(str) {
    let count = 0;
    let lastChar = "";
    let ret = "";
    for (let i = 0 ; i < str.length ; i++) {
        const c = str[i];
        if (!lastChar || lastChar.length <= 0) {
            lastChar = c;
        }
        if (lastChar === c) {
            count++;
        } else {
            ret += countStr(count, lastChar);
            count = 1;
            lastChar = c;
        }
    }
    ret += countStr(count, lastChar);

    function countStr(count, lastChar) {
        return "" + ((count > 1) ? count : "") + lastChar;
    }
    return ret;
}

function decodeRLE(str) {
    if (str.length !== 0) {
        let ret = "";
        let c = '';
        let s = "";
        for (let i = 0 ; i < str.length ; i++) {
            c = str[i];
            if (isDigit(c)) {
                s += c;
            } else {
                let rep = parseInt(s, 10);
                if (isNaN(rep)) {
                    rep = 1;
                }                
                const temp = c.repeat(rep);
                ret += temp;
                s = "";
            }
        }
        return ret;
    }
    return str;
}

function isDigit(c) {
    return (c >= '0' && c <= '9');
}

function isRLETextValid(text) {
    if (text.includes("!")) {
        return true;
    }
    return false;
}

function matrixToText(matrix) {
    let ret = ""
    for (let i = 0; i < matrix.length ; i++) {
        ret += encodeRow(matrix[i]) + ((i === matrix.length - 1) ? "!" : "$");
    }
    function encodeRow(row) {
        let s = "";
        for (let i = 0 ; i < row.length ; i++) {
            if (row[i] <= 0) {
                s += 'b';
            } else {
                s += 'o';
            }
        }
        return encodeRLE(s);
    }
    return ret;
}