const React = require('react');
const { useState } = require('react');
const { Box, Text, useInput } = require('ink');
const importJsx = require('import-jsx');
const { useQueue } = require('../../../hooks/use-queue');
const { UPDATE_LEADING_SIGN, USER_INPUT_LIMIT } = require('../../../utils/constants');
const QueueComponent = importJsx('../queue');

const MeaningComponent = () => {
  const [ queues, activeQueue, completed, updateLeadingSign ] = useQueue();

  const [ userInput, updateUserInput ] = useState('');

  useInput((input, key) => {
    if (key.return) {
      updateUserInput('');
      updateLeadingSign(UPDATE_LEADING_SIGN.advance);

      return;
    }

    if (key.backspace || key.delete) {
      updateUserInput(i => i.substr(0, i.length - 1));

      return;
    }

    if (input.match(/^[a-zA-Z0-9]$/i) && userInput.length < USER_INPUT_LIMIT) {
      updateUserInput(i => i + input);
    }
  });

  return (
    <Box
      paddingX={4}
      paddingY={2}
      marginX={4}
      marginY={2}
      flexDirection="column"
      alignItems="center"
    >
      <Box flexDirection="column">
        <QueueComponent queue={queues[2]} isActive={activeQueue === 2} />
        <QueueComponent queue={queues[1]} isActive={activeQueue === 1} />
        <QueueComponent queue={queues[0]} isActive={activeQueue === 0} />
      </Box>
      <Box
        padding={1}
        minWidth={20}
        flexDirection="row"
      >
        <Box
          padding={1}
          flexGrow={1}
          flexDirection="column"
          borderStyle="round"
          borderColor="#594444"
        >
          <Text color="#999999">
            Describe meaning of
            <Text color="#a63333">
              {' highlighted '} 
            </Text>
            sign:
          </Text>
          <Text>
            {`${userInput}${Array(USER_INPUT_LIMIT).fill('_').join('')}`.substr(0, USER_INPUT_LIMIT)}
          </Text>
        </Box>
        <Box
          padding={1}
          flexGrow={1}
          flexDirection="column"
          borderStyle="round"
          borderColor="#594444"
        >
          <Text color="#999999">
            Actual meaning:
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

module.exports = MeaningComponent;
