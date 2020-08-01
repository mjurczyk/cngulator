const { _UNDEF_ } = require('./constants');
const { simplifyString } = require('./simplify-string');

module.exports = {
  sign: (
    character,
    meanings = [],
    pronunciation,
    example,
    level,
  ) => {
    if (
      !character ||
      (!meanings || meanings.length === 0) ||
      !pronunciation
    ) {
      return _UNDEF_;
    }

    const simplePronunciation = simplifyString(pronunciation);

    const schema = ({
      character,
      meanings,
      pronunciation: simplePronunciation,
      example
    });

    if (typeof level === 'number') {
      return { ...schema, level };
    } else {
      return (promisedLevel = 0) => ({
        ...schema,
        level: promisedLevel
      });
    }
  }
};
