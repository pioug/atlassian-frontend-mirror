import { MockPerformanceEntry } from '@atlaskit/editor-test-helpers/mock-performance-entry';
import { MockPerformanceObserverEntryList } from '@atlaskit/editor-test-helpers/mock-performance-observer-entry-list';
import { PluginPerformanceReport } from '../../plugin-performance-report';
import {
  EVENT_NAME_STATE_APPLY,
  EVENT_NAME_UPDATE_STATE,
  EVENT_NAME_ON_CHANGE,
} from '../../track-transactions';

describe('PluginPerformanceReport.fromEntry', () => {
  it('creates a minimal report', () => {
    const duration = Math.random();
    const entry = MockPerformanceEntry.fromDuration(duration);
    const report = PluginPerformanceReport.fromEntry(entry);

    expect(report.toJSON()).toMatchObject({
      trigger: 'none',
      duration,
    });
  });
});

describe('PluginPerformanceReport.prototype.trigger', () => {
  it('returns trigger "none" for count % 100 !== 0', () => {
    const entry = MockPerformanceEntry.default();
    const report = PluginPerformanceReport.fromEntry(entry).withCount(99);

    expect(report.toJSON()).toMatchObject({
      trigger: 'none',
    });
  });

  it('returns trigger "sample" for count % 100 === 0', () => {
    const entry = MockPerformanceEntry.default();
    const report = PluginPerformanceReport.fromEntry(entry).withCount(100);

    expect(report.toJSON()).toMatchObject({
      trigger: 'sample',
    });
  });

  it('returns trigger "distribution" for slow plugins', () => {
    const series = [0.1, 0.15, 0.1, 0.01, 1, 3, 30];
    const entryList = MockPerformanceObserverEntryList.fromSeries(series);
    const entry = MockPerformanceEntry.fromSeries(series);

    const report = PluginPerformanceReport.fromEntry(entry)
      .withEntryList(entryList)
      .withPlugins(series.map((_, i) => String(i)));

    expect(report.toJSON()).toMatchObject({
      trigger: 'distribution',
      slowPlugins: expect.objectContaining({
        6: expect.objectContaining({ stateApply: 30 }),
      }),
    });
  });

  it('returns trigger "none" for slow plugins in fast execution', () => {
    const series = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 14];
    const entryList = MockPerformanceObserverEntryList.fromSeries(series);
    const entry = MockPerformanceEntry.fromSeries(series);

    const report = PluginPerformanceReport.fromEntry(entry)
      .withCount(99)
      .withEntryList(entryList)
      .withPlugins(series.map((_, i) => String(i)));

    expect(report.toJSON()).toMatchObject({
      trigger: 'none',
      slowPlugins: expect.objectContaining({
        [series.length - 1]: expect.objectContaining({ stateApply: 14 }),
      }),
    });
  });
});

describe('PluginPerformanceReport.prototype.hasSlowPlugins', () => {
  it('returns hasSlowPlugins false for minimal report', () => {
    const entry = MockPerformanceEntry.default();
    const report = PluginPerformanceReport.fromEntry(entry);

    expect(report.hasSlowPlugins).toBe(false);
  });

  it('returns hasSlowPlugins false for fast plugins', () => {
    const series = [0.1, 0.15, 0.1, 0.01];
    const entryList = MockPerformanceObserverEntryList.fromSeries(series);
    const entry = MockPerformanceEntry.fromSeries(series);

    const report = PluginPerformanceReport.fromEntry(entry)
      .withEntryList(entryList)
      .withPlugins(series.map((_, i) => String(i)));

    expect(report.hasSlowPlugins).toBe(false);
  });

  it('returns hasSlowPlugins true for slow plugins', () => {
    const series = [0.1, 0.15, 0.1, 0.01, 1, 3, 30];
    const entryList = MockPerformanceObserverEntryList.fromSeries(series);
    const entry = MockPerformanceEntry.fromSeries(series);

    const report = PluginPerformanceReport.fromEntry(entry)
      .withEntryList(entryList)
      .withPlugins(series.map((_, i) => String(i)));

    expect(report.hasSlowPlugins).toBe(true);
  });
});

describe('PluginPerformanceReport.prototype.withEntryList', () => {
  it('populates stepDurations if provided', () => {
    const entry = MockPerformanceEntry.default();
    const report = PluginPerformanceReport.fromEntry(entry).withEntryList(
      MockPerformanceObserverEntryList.fromNames([
        EVENT_NAME_STATE_APPLY,
        EVENT_NAME_UPDATE_STATE,
        EVENT_NAME_ON_CHANGE,
      ]),
    );

    expect(report.toJSON()).toMatchObject({
      stepDurations: {
        stateApply: 1,
        viewUpdate: 1,
        onChange: 1,
      },
    });
  });

  it('defaults step duration to 0 if missing', () => {
    const entry = MockPerformanceEntry.default();

    const report = PluginPerformanceReport.fromEntry(entry).withEntryList(
      MockPerformanceObserverEntryList.fromNames([
        EVENT_NAME_STATE_APPLY,
        EVENT_NAME_ON_CHANGE,
      ]),
    );

    expect(report.toJSON()).toMatchObject({
      stepDurations: {
        stateApply: 1,
        viewUpdate: 0,
        onChange: 1,
      },
    });
  });

  it('updates the plugin field', () => {
    const series = [0.1, 0.15, 0.1, 0.01];
    const entryList = MockPerformanceObserverEntryList.fromSeries(series);
    const entry = MockPerformanceEntry.fromSeries(series);

    const emptyReport = PluginPerformanceReport.fromEntry(entry).withPlugins(
      series.map((_, i) => String(i)),
    );

    expect(emptyReport.toJSON().plugins).toEqual({
      0: expect.objectContaining({ stateApply: 0 }),
      1: expect.objectContaining({ stateApply: 0 }),
      2: expect.objectContaining({ stateApply: 0 }),
      3: expect.objectContaining({ stateApply: 0 }),
    });

    const report = emptyReport.withEntryList(entryList);
    expect(report.toJSON().plugins).toEqual({
      0: expect.objectContaining({ stateApply: 0.1 }),
      1: expect.objectContaining({ stateApply: 0.15 }),
      2: expect.objectContaining({ stateApply: 0.1 }),
      3: expect.objectContaining({ stateApply: 0.01 }),
    });
  });

  it('updates the slowPlugins field', () => {
    const fastSeries = [0.1, 0.15, 0.1, 0.01, 0.1, 0.1, 0.1];
    const slowSeries = [0.1, 0.15, 0.1, 0.01, 1, 3, 30];
    const fastEntryList = MockPerformanceObserverEntryList.fromSeries(
      fastSeries,
    );
    const slowEntryList = MockPerformanceObserverEntryList.fromSeries(
      slowSeries,
    );

    const entry = MockPerformanceEntry.fromSeries(slowSeries);

    const fastReport = PluginPerformanceReport.fromEntry(entry)
      .withEntryList(fastEntryList)
      .withPlugins(fastSeries.map((_, i) => String(i)));

    const slowReport = fastReport.withEntryList(slowEntryList);

    expect(slowReport.toJSON()).toMatchObject({
      slowPlugins: expect.objectContaining({
        6: expect.objectContaining({ stateApply: 30 }),
      }),
    });
  });
});

describe('PluginPerformanceReport.prototype.withNodes', () => {
  it('defaults to empty object', () => {
    const entry = MockPerformanceEntry.default();
    const report = PluginPerformanceReport.fromEntry(entry);
    expect(report.toJSON().nodes).toEqual({});
  });

  it('exposes on nodes field', () => {
    const entry = MockPerformanceEntry.default();
    const report = PluginPerformanceReport.fromEntry(entry).withNodes({
      nodeCount: {
        doc: 1,
      },
      extensionNodeCount: {},
    });

    expect(report.toJSON().nodes).toEqual({ doc: 1 });
  });
});
