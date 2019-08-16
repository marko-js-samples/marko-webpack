const marked = require("marked");

function removeIndentation(str) {
  const indentMatches = /\s*\n(\s+)/.exec(str);
  if (indentMatches) {
    const indent = indentMatches[1];
    str = str.replace(new RegExp("^" + indent, "mg"), "");
  }
  return str;
}

module.exports = function({ bodyText }, { builder }) {
  const html = marked(removeIndentation(bodyText));
  return builder.html(builder.literal(html));
};
