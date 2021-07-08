import {
  NodesCount,
  PluginPerformanceReportData,
  PluginPerformanceReport,
  PluginPerformanceReportOptions,
} from './plugin-performance-report';
import {
  DEFAULT_USE_PERFORMANCE_MARK,
  EVENT_NAME_DISPATCH_TRANSACTION,
  TransactionTracker,
} from './track-transactions';
import { SimpleMeasurementLogger } from './simple-measure-to-entries';
export class PluginPerformanceObserver implements PerformanceObserver {
  private getNodeCounts: () => [NodesCount, number] = () => [
    { nodeCount: {}, extensionNodeCount: {} },
    0,
  ];
  private getPlugins: () => string[] = () => [];
  private getOptions: () => Partial<
    PluginPerformanceReportOptions
  > = () => ({});

  private reportCount = 0;
  private simpleObserver = new SimpleMeasurementLogger();
  private observer: PerformanceObserver;
  private getTransactionTracker?: () => TransactionTracker;

  constructor(private callback: (report: PluginPerformanceReportData) => void) {
    this.observer = window.PerformanceObserver
      ? new PerformanceObserver(this.onObserveration)
      : {
          observe() {},
          disconnect() {},
          takeRecords() {
            return [];
          },
        };
  }

  private get isSimpleTracking(): boolean {
    const {
      usePerformanceMarks = DEFAULT_USE_PERFORMANCE_MARK,
    } = this.getOptions();
    return !usePerformanceMarks;
  }

  public withNodeCounts(getNodeCounts: () => NodesCount): this {
    this.getNodeCounts = () => {
      const start = performance.now();
      const result = getNodeCounts();
      return [result, performance.now() - start];
    };
    return this;
  }

  public withPlugins(getPlugins: () => string[]): this {
    this.getPlugins = getPlugins;
    return this;
  }

  public withOptions(
    getOptions: () => Partial<PluginPerformanceReportOptions>,
  ): this {
    this.getOptions = getOptions;
    return this;
  }

  public withTransactionTracker(
    getTransactionTracker: () => TransactionTracker,
  ): this {
    this.getTransactionTracker = getTransactionTracker;
    return this;
  }

  private onObserveration: PerformanceObserverCallback = (entries) => {
    const reports: PluginPerformanceReportData[] = entries
      .getEntriesByName(EVENT_NAME_DISPATCH_TRANSACTION)
      .map((entry) =>
        PluginPerformanceReport.fromEntry(entry)
          .withCount(++this.reportCount)
          .withEntryList(entries)
          .withNodes(...this.getNodeCounts())
          .withPlugins(this.getPlugins())
          .withOptions(this.getOptions())
          .toJSON(),
      );

    reports
      .filter((report) => report.trigger !== 'none')
      .forEach((report) => this.callback(report));
  };

  public observe() {
    if (this.isSimpleTracking) {
      this.simpleObserver.setPluginNames(this.getPlugins());
      this.simpleObserver.setOnObservation((entries) => {
        this.onObserveration(entries, this.observer);
      });

      // can trigger a callback when stopMeasure() measures something.
      // use that to trigger this.onObservation()
      this.getTransactionTracker &&
        this.getTransactionTracker().addMeasureListener(
          this.simpleObserver.observed,
        );
    } else {
      try {
        this.observer.observe({
          buffered: false,
          type: 'measure',
        });
      } catch (err) {
        // Older API implementations do not support the simpler type init
        this.observer.observe({
          entryTypes: ['measure'],
        });
      }
    }
  }

  public disconnect() {
    if (this.isSimpleTracking) {
      this.getTransactionTracker &&
        this.getTransactionTracker().removeMeasureListener(
          this.simpleObserver.observed,
        );
    } else {
      this.observer.disconnect();
    }
  }

  public takeRecords() {
    return this.observer.takeRecords();
  }
}
