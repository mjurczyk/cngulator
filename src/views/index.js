const React = require('react');
const importJsx = require('import-jsx');
const { render } = require('ink');

// NOTE View
const ViewComponent = importJsx('./cli/meaning');

// NOTE State
const { HSK1_COLLECTION } = require('../../data/hsk-1');

const { CoreService } = require('../services/core-service');
CoreService.fromSet(HSK1_COLLECTION);
CoreService.setQueueLimit(4);
CoreService.createLimit(10, false);
CoreService.createQueues();
CoreService.refillQueueFromStash(CoreService.getFirstQueue());

render(React.createElement(ViewComponent));
