const { _UNDEF_ } = require('./constants');
const { simplifyString } = require('./simplify-string');

module.exports = {
  sign: (
    character,
    meanings = [],
    pronounciation,
    example,
    level,
  ) => {
    if (
      !character ||
      (!meanings || meanings.length === 0) ||
      !pronounciation
    ) {
      return _UNDEF_;
    }

    const simplePronounciation = simplifyString(pronounciation);
    const simpleMeanings = meanings.map(word => simplifyString(word));

    const schema = ({
      character,
      meanings: simpleMeanings,
      pronounciation: simplePronounciation,
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
