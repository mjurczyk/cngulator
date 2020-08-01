const { ensureArray } = require('../utils/ensure-array');
const { QUEUE_SIZE, QUEUE_COUNT, SUBSET_LIMIT, _UNDEF_ } = require('../utils/constants');

class CoreService {
  constructor() {
    this.stash = _UNDEF_;
    this.queues = _UNDEF_;
    this.queueLimit = QUEUE_SIZE;
    this.currentSign = _UNDEF_;
  }

  fromSet(setA, setB = [], setC = [], ...rest) {
    this.stash = [
      ...ensureArray(setA),
      ...ensureArray(setB),
      ...ensureArray(setC),
      ...ensureArray(rest.reduce((result, partial) => result.concat(partial), []))
    ];
  }

  createLimit(limit = SUBSET_LIMIT, randomizeSet = RANDOMIZE_SUBSET) {
    const result = [];

    for (let i = 0; i < limit; i++) {
      const pickIndex = randomizeSet ? Math.floor(Math.random() * this.stash.length) : i;

      result.push(this.stash.splice(pickIndex, 1)[0]);
    }

    this.stash = result;
  }

  createQueues(count = QUEUE_COUNT) {
    this.queues = Array(count).fill(0).map(_ => []);
  }

  setQueueLimit(limit = QUEUE_SIZE) {
    this.queueLimit = limit;
  }

  refillQueueFromStash(queue) {
    const refillLength = this.queueLimit - queue.length;
    const refill = this.stash.splice(0, refillLength);

    queue.push(...refill);
  }

  getFirstQueue() {
    return this.queues[0];
  }

  getLastQueue() {
    return this.queues[this.queues.length - 1];
  }

  getQueueById(id = 0) {
    return this.queues[id];
  }

  getQueuedSigns() {
    return this.queues.map(queue => queue.map(({ character }) => character));
  }

  getStashLength() {
    return this.stash.length;
  }

  getQueuedLength() {
    return this.queues.reduce((total, queue) => total + queue.length, 0);
  }

  // NOTE Pick first filled queue (descending.)
  //      If no queue is filled, pick the lowest non-empty queue.
  getActiveQueue() {
    const activeQueueIndex = this.getActiveQueueIndex();

    if (activeQueueIndex === -1) {
      return _UNDEF_;
    }

    return this.queues[activeQueueIndex];
  }

  getActiveQueueIndex() {
    const firstFilledQueueIndex = [...this.queues].reverse().findIndex(queue => queue.length === this.queueLimit);

    if (firstFilledQueueIndex !== -1) {
      return this.queues.length - 1 - firstFilledQueueIndex;
    }

    const lastNonemptyQueueIndex = this.queues.findIndex(queue => queue.length > 0);

    if (lastNonemptyQueueIndex !== -1) {
      return lastNonemptyQueueIndex;
    }

    return -1;
  }

  getLeadingSign() {
    const activeQueue = this.getActiveQueue();

    if (activeQueue) {
      return activeQueue[0];
    }

    return _UNDEF_;
  }

  advanceLeadingSign() {
    const activeQueue = this.getActiveQueue();

    if (!activeQueue || activeQueue.length === 0) {
      return;
    }

    const nextQueueIndex = this.getActiveQueueIndex() + 1;
    const leadingSign = activeQueue.splice(0, 1)[0];

    if (nextQueueIndex > this.queues.length - 1) {
      return;
    }

    this.queues[nextQueueIndex].push(leadingSign);
  }

  resetLeadingSign() {
    const activeQueue = this.getActiveQueue();

    if (!activeQueue || activeQueue.length === 0) {
      return;
    }

    const leadingSign = activeQueue.splice(0, 1)[0];

    this.stash.unshift(leadingSign);
  }
}

module.exports = {
  CoreService: new CoreService()
};
