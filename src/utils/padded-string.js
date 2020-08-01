module.exports = {
  paddedString: (value, padding = 1) => `${Array(padding).fill(' ').join('')}${value}${Array(padding).fill(' ').join('')}`
};
