const tokenize = function (source) {
  const tokens = getTokens(source);
  // const formattedSource = formatSourceFile(source);
  // getOccurences(tokenValues, formattedSource);

  return tokens;
};

const getTokens = function (source) {
  let buffer = source;
  buffer = removeComments(buffer);
  buffer = formatPrefixes(buffer);
  buffer = removeLineJumps(buffer);
  return buffer
    .split(" ")
    .filter((token) => token !== "")
    .map((token, index) => {
      return {
        i: index + 1,
        value: token,
      };
    });
};

const removeComments = function (source) {
  const buffer = source;
  return buffer.replace(/\<(.*)\>/g, "");
};
const formatPrefixes = function (source) {
  const buffer = source;
  return buffer
    .replace(/\;/g, " ; ")
    .replace(/\:/g, " : ")
    .replace(/\$/g, " $ ")
    .replace(/\#/g, " # ");
};

const removeLineJumps = function (source) {
  const buffer = source;
  return buffer.replace(/\s\s+/g, " ");
};
//TODO: find out how to implement the line recognition functionality
// const formatSourceFile = function (source) {
//   let buffer = source;
//   buffer = buffer.replace(/\<(.*)\>/g, " ");
//   buffer = formatPrefixes(buffer);
//   buffer = buffer.split(/\r?\n/).join("\n");
//   return buffer;
// };

// const getOccurences = function (tokens, source) {
//   const lines = source.split(/\r?\n/);
//   const tokenSet = new Set(tokens);
//   const occurences = [];
//   lines.forEach((line, index) => {
//     tokenSet.forEach((token) => {
//       if (line.includes(token)) {
//         occurences.push({
//           value: token,
//           line: index + 1,
//         });
//       }
//     });
//   });
//   console.log(occurences);
// };

module.exports = tokenize;
