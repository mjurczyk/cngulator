const React = require('react');
const { Fragment, useState } = require('react');
const { Box, Text, useInput, Newline, useApp } = require('ink');
const importJsx = require('import-jsx');
const { useQueue } = require('../../../hooks/use-queue');
const { UPDATE_LEADING_SIGN, USER_INPUT_LIMIT, SUBSET_LIMIT } = require('../../../utils/constants');
const { paddedString } = require('../../../utils/padded-string');
const QueueComponent = importJsx('../queue');

const styleHighlightedText = {
  backgroundColor: '#ffffff',
  color: '#000000'
};

const styleVisibleMeaning = {
  backgroundColor: '',
  color: '#ffffff'
};

const styleHiddenMeaning = {
  backgroundColor: '#999999',
  color: '#999999'
};

const MeaningComponent = () => {
  const [ queues, activeQueue, leadingSign, completed, updateLeadingSign ] = useQueue();
  const { exit } = useApp();
  const [ userInput, updateUserInput ] = useState('');
  const [ verifyInput, updateVerifyInput ] = useState({
    selectionIndex: 0,
    visible: false
  });

  useInput((input, key) => {
    if (key.return) {
      if (completed) {
        exit();

        return;
      }

      if (!verifyInput.visible) {
        updateVerifyInput({ selectionIndex: 0, visible: true });
      }
      
      if (verifyInput.visible) {
        if (verifyInput.selectionIndex === 0) {
          updateLeadingSign(UPDATE_LEADING_SIGN.advance);
        }

        if (verifyInput.selectionIndex === 1) {
          updateLeadingSign(UPDATE_LEADING_SIGN.reset);
        }

        updateUserInput('');
        updateVerifyInput({ selectionIndex: 0, visible: false });
      }

      return;
    }

    if (key.leftArrow) {
      if (verifyInput.visible) {
        updateVerifyInput({ ...verifyInput, selectionIndex: 0 });
      }

      return;
    }

    if (key.rightArrow) {
      if (verifyInput.visible) {
        updateVerifyInput({ ...verifyInput, selectionIndex: 1 });
      }

      return;
    }

    if (key.backspace || key.delete) {
      if (!verifyInput.visible) {
        updateUserInput(i => i.substr(0, i.length - 1));
      }

      return;
    }

    if (userInput.length < USER_INPUT_LIMIT && input.match(/^[a-zA-Z0-9]$/i)) {
      if (!verifyInput.visible) {
        updateUserInput(i => i + input);
      }
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
      <Box
        padding={1}
        flexDirection="row"
      >
        <Text>
          HSK Characters Test
        </Text>
      </Box>
      {completed && (
        <Box
          padding={1}
          flexDirection="row"
        >
          <Text color="#ff5050">
            All done! ᕦ(⏒‿⏒)ᕥ
            <Newline/>
            Press Enter to exit
          </Text>
        </Box>
      )}
      {!completed && (
        <>
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
              <Text color="#ffffff">
                Describe the
                <Text color="#ff5050">
                  {paddedString('highlighted')}
                </Text>
                sign:
              </Text>
              <Text color="#ffffff">
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
                Pronunciation:
              </Text>
              <Text {...(verifyInput.visible ? styleVisibleMeaning : styleHiddenMeaning)}>
                {leadingSign && (
                  <Text>
                    {`${leadingSign.pronunciation}${Array(USER_INPUT_LIMIT).fill(' ').join('')}`.substr(0, USER_INPUT_LIMIT)}
                  </Text>
                )}
              </Text>
              <Newline />
              <Text color="#999999">
                Meaning:
              </Text>
              <Text {...(verifyInput.visible ? styleVisibleMeaning : styleHiddenMeaning)}>
                {leadingSign && leadingSign.meanings.map((meaning, index) => (
                  <Fragment key={Math.random()}>
                    {index > 0 && <Newline />}
                    <Text>
                      {`${meaning}${Array(USER_INPUT_LIMIT).fill(' ').join('')}`.substr(0, USER_INPUT_LIMIT)}
                    </Text>
                  </Fragment>
                ))}
              </Text>
            </Box>
          </Box>
          <Box
            padding={1}
            minWidth={20}
            flexDirection="row"
          >
            <Text color="#ffffff">
              {verifyInput.visible && (
                <>
                  Was your answer correct?{' '}
                  <Text {...(verifyInput.selectionIndex === 0 ? styleHighlightedText : {})}>
                    {paddedString('Yes')}
                  </Text>{' '}
                  <Text {...(verifyInput.selectionIndex === 1 ? styleHighlightedText : {})}>
                    {paddedString('No')}
                  </Text>
                </> 
              )}
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
};

module.exports = MeaningComponent;
