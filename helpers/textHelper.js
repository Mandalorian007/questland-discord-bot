
// Change straight quotes to curly and double hyphens to em-dashes.
exports.smarten = (text) => {
    text = text.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
    text = text.replace(/'/g, "\u2019");                            // closing singles & apostrophes
    text = text.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
    text = text.replace(/"/g, "\u201d");                            // closing doubles
    text = text.replace(/--/g, "\u2014");                           // em-dashes
    return text
};