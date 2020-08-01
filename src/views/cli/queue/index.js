const React = require('react');
const { Text, Box } = require('ink');
const { CoreService } = require('../../../services/core-service');

const QueueComponent = ({
  queue = [],
  isActive = false
}) => {
  const queuePlaceholder = Array(CoreService.queueLimit).fill('');
  const invertedQueue = queuePlaceholder.concat([...queue].reverse()).slice(-CoreService.queueLimit);

  return (
    <Box
      padding={1}
      minWidth={20}
      justifyContent="flex-end"
      flexDirection="row"
    >
      {invertedQueue.map(({ character }, index) => {
        const highlightSign = isActive && index === invertedQueue.length - 1;

        return (
          <Box
            key={Math.random()}
            padding={1}
            minWidth={20}
            alignItems="center"
            flexDirection="column"
          >
            <Text
              color={highlightSign ? '#ff5050' : '#777777'}
            >
              {character}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

module.exports = QueueComponent;
