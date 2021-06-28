import { SimpleMeasurementLogger } from '../../simple-measure-to-entries';
import {
  EVENT_NAME_DISPATCH_TRANSACTION,
  EVENT_NAME_STATE_APPLY,
  EVENT_NAME_UPDATE_STATE,
  EVENT_NAME_VIEW_STATE_UPDATED,
  EVENT_NAME_ON_CHANGE,
} from '../../track-transactions';

const createReading = (
  name: string,
): { name: string; duration: number; startTime: number } => {
  return {
    name,
    duration: 1,
    startTime: Date.now(),
  };
};

const getEntryList = (
  callback: jest.Mock,
  callIndex: number,
): PerformanceObserverEntryList => {
  return callback.mock.calls[callIndex][0] as PerformanceObserverEntryList;
};

describe('SimpleMeasurementLogger', () => {
  let logger: SimpleMeasurementLogger;
  let callback = jest.fn();

  beforeEach(() => {
    logger = new SimpleMeasurementLogger();
    callback.mockReset();
  });

  it('should call callback on a single batch', () => {
    logger.setOnObservation(callback);
    logger.observed(createReading(EVENT_NAME_STATE_APPLY));
    logger.observed(createReading(EVENT_NAME_UPDATE_STATE));
    logger.observed(createReading(EVENT_NAME_VIEW_STATE_UPDATED));
    logger.observed(createReading(EVENT_NAME_ON_CHANGE));
    logger.observed(createReading(EVENT_NAME_DISPATCH_TRANSACTION));

    expect(callback).toBeCalledTimes(1);
    const entries = getEntryList(callback, 0).getEntries();
    expect(entries.map((entry) => entry.name)).toEqual([
      EVENT_NAME_STATE_APPLY,
      EVENT_NAME_UPDATE_STATE,
      EVENT_NAME_VIEW_STATE_UPDATED,
      EVENT_NAME_ON_CHANGE,
      EVENT_NAME_DISPATCH_TRANSACTION,
    ]);
  });

  it('should call callback twice on two batches', () => {
    logger.setOnObservation(callback);
    logger.observed(createReading(EVENT_NAME_STATE_APPLY));
    logger.observed(createReading(EVENT_NAME_UPDATE_STATE));
    logger.observed(createReading(EVENT_NAME_VIEW_STATE_UPDATED));
    logger.observed(createReading(EVENT_NAME_ON_CHANGE));
    logger.observed(createReading(EVENT_NAME_DISPATCH_TRANSACTION));

    logger.observed(createReading(EVENT_NAME_STATE_APPLY));
    logger.observed(createReading(EVENT_NAME_UPDATE_STATE));
    logger.observed(createReading(EVENT_NAME_VIEW_STATE_UPDATED));
    logger.observed(createReading(EVENT_NAME_DISPATCH_TRANSACTION));

    expect(callback).toBeCalledTimes(2);
    const entries1 = getEntryList(callback, 0).getEntries();
    const entries2 = getEntryList(callback, 1).getEntries();
    expect(entries1.map((entry) => entry.name)).toEqual([
      EVENT_NAME_STATE_APPLY,
      EVENT_NAME_UPDATE_STATE,
      EVENT_NAME_VIEW_STATE_UPDATED,
      EVENT_NAME_ON_CHANGE,
      EVENT_NAME_DISPATCH_TRANSACTION,
    ]);
    expect(entries2.map((entry) => entry.name)).toEqual([
      EVENT_NAME_STATE_APPLY,
      EVENT_NAME_UPDATE_STATE,
      EVENT_NAME_VIEW_STATE_UPDATED,
      EVENT_NAME_DISPATCH_TRANSACTION,
    ]);
  });

  it('should only log known plugins', () => {
    logger.setOnObservation(callback);
    logger.setPluginNames(['pluginA', 'pluginB']);
    logger.observed(createReading(EVENT_NAME_STATE_APPLY));
    logger.observed(createReading(EVENT_NAME_UPDATE_STATE));
    logger.observed(createReading(`🦉pluginA::apply`));
    logger.observed(createReading(`🦉pluginA::view::update`));
    logger.observed(createReading(`🦉pluginB::apply`));
    logger.observed(createReading(`🦉pluginB::view::update`));
    logger.observed(createReading(`🦉pluginC::apply`));
    logger.observed(createReading(`🦉pluginC::view::update`));
    logger.observed(createReading(EVENT_NAME_DISPATCH_TRANSACTION));

    expect(callback).toBeCalledTimes(1);
    const entries = getEntryList(callback, 0).getEntries();
    expect(entries.map((entry) => entry.name)).toEqual([
      EVENT_NAME_STATE_APPLY,
      EVENT_NAME_UPDATE_STATE,
      '🦉pluginA::apply',
      '🦉pluginA::view::update',
      '🦉pluginB::apply',
      '🦉pluginB::view::update',
      EVENT_NAME_DISPATCH_TRANSACTION,
    ]);
  });

  it('should only log known transaction events', () => {
    logger.setOnObservation(callback);
    logger.observed(createReading(EVENT_NAME_STATE_APPLY));
    logger.observed(createReading(`🦉 EditorView::fake-event`));
    logger.observed(createReading(EVENT_NAME_DISPATCH_TRANSACTION));

    expect(callback).toBeCalledTimes(1);
    const entries = getEntryList(callback, 0).getEntries();
    expect(entries.map((entry) => entry.name)).toEqual([
      EVENT_NAME_STATE_APPLY,
      EVENT_NAME_DISPATCH_TRANSACTION,
    ]);
  });

  it('should not log events without the 🦉 prefix', () => {
    logger.setOnObservation(callback);
    logger.observed(createReading('nope'));
    logger.observed(createReading(EVENT_NAME_DISPATCH_TRANSACTION));

    expect(callback).toBeCalledTimes(1);
    const entries = getEntryList(callback, 0).getEntries();
    expect(entries.map((entry) => entry.name)).toEqual([
      EVENT_NAME_DISPATCH_TRANSACTION,
    ]);
  });

  it('should not call callback if EVENT_NAME_DISPATCH_TRANSACTION is never observed', () => {
    logger.setOnObservation(callback);
    logger.observed(createReading(EVENT_NAME_STATE_APPLY));
    expect(callback).toBeCalledTimes(0);
  });

  it('should clear current batch even if callback is not set', () => {
    // run these before callback is set
    logger.observed(createReading(EVENT_NAME_UPDATE_STATE));
    logger.observed(createReading(EVENT_NAME_DISPATCH_TRANSACTION));

    // currentBatch should be empty now
    logger.setOnObservation(callback);
    logger.observed(createReading(EVENT_NAME_STATE_APPLY));
    logger.observed(createReading(EVENT_NAME_DISPATCH_TRANSACTION));

    expect(callback).toBeCalledTimes(1);
    const entries = getEntryList(callback, 0).getEntries();
    expect(entries.map((entry) => entry.name)).toEqual([
      EVENT_NAME_STATE_APPLY,
      EVENT_NAME_DISPATCH_TRANSACTION,
    ]);
  });

  describe('convertToEntryList', () => {
    const logger = new SimpleMeasurementLogger();
    const callback = jest.fn();

    logger.setOnObservation(callback);
    logger.observed(createReading(EVENT_NAME_STATE_APPLY));
    logger.observed(createReading(EVENT_NAME_UPDATE_STATE));
    logger.observed(createReading(EVENT_NAME_VIEW_STATE_UPDATED));
    logger.observed(createReading(EVENT_NAME_DISPATCH_TRANSACTION));

    const entryList = getEntryList(callback, 0);

    it('getEntries() should return all entries', () => {
      const results = entryList.getEntries();
      [
        EVENT_NAME_STATE_APPLY,
        EVENT_NAME_UPDATE_STATE,
        EVENT_NAME_VIEW_STATE_UPDATED,
        EVENT_NAME_DISPATCH_TRANSACTION,
      ].forEach((name, index) => {
        expect(results[index]).toMatchObject({
          entryType: 'mark',
          name: name,
        });
      });
    });

    it('getEntriesByType() should return all entries', () => {
      expect(entryList.getEntriesByType('mark')).toEqual(
        entryList.getEntries(),
      );
    });

    it('getEntriesByName() should filter entries', () => {
      const results = entryList.getEntriesByName(EVENT_NAME_VIEW_STATE_UPDATED);
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        entryType: 'mark',
        name: '🦉 EditorView::onEditorViewStateUpdated',
        duration: 1,
      });

      expect(entryList.getEntriesByName(EVENT_NAME_ON_CHANGE)).toEqual([]);
    });
  });
});
