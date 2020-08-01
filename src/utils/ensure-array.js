module.exports = {
  ensureArray: (value) => {
    if (!value || !(value instanceof Array)) {
      return [];
    }

    return value;
  }
};
