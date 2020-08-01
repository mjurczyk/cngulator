const { useState } = require('react');
const { CoreService } = require('../services/core-service');
const { UPDATE_LEADING_SIGN } = require('../utils/constants');

const useQueue = () => {
  const [ _, updateTick ] = useState(0);
  const [ completed, updateCompleted ] = useState(false);

  const queues = CoreService.queues;
  const activeQueue = CoreService.getActiveQueueIndex();

  return [
    queues,
    activeQueue,
    completed,
    (result = UPDATE_LEADING_SIGN.advance) => {
      if (result === UPDATE_LEADING_SIGN.advance) {
        CoreService.advanceLeadingSign();
      } else if (result === UPDATE_LEADING_SIGN.reset) {
        CoreService.resetLeadingSign();
      }

      CoreService.refillQueueFromStash(CoreService.getFirstQueue());

      if (CoreService.getStashLength() + CoreService.getQueuedLength() === 0) {
        updateCompleted(true);
      }

      updateTick(t => t + 1);
    }
  ];
};

module.exports = {
  useQueue
};
