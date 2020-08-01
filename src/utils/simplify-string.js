module.exports = {
  simplifyString: (string) => {
    return `${string}`.trim().replace(/\s/gm, '').toLowerCase();
  }
};
