import {
  PluginPerformanceReportData,
  PluginPerformanceReport,
  PluginPerformanceReportOptions,
} from './plugin-performance-report';

export class PluginPerformanceObserver implements PerformanceObserver {
  private getNodeCounts: () => [{ [name: string]: number }, number] = () => [
    {},
    0,
  ];
  private getPlugins: () => string[] = () => [];
  private getOptions: () => Partial<
    PluginPerformanceReportOptions
  > = () => ({});

  private reportCount = 0;

  constructor(
    private callback: (report: PluginPerformanceReportData) => void,
  ) {}

  public withNodeCounts(getNodeCounts: () => { [name: string]: number }): this {
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

  private onObserveration: PerformanceObserverCallback = entries => {
    const reports: PluginPerformanceReportData[] = entries
      .getEntriesByName('🦉 ReactEditorView::dispatchTransaction')
      .map(entry =>
        PluginPerformanceReport.fromEntry(entry)
          .withCount(++this.reportCount)
          .withEntryList(entries)
          .withNodes(...this.getNodeCounts())
          .withPlugins(this.getPlugins())
          .withOptions(this.getOptions())
          .toJSON(),
      );

    reports
      .filter(report => report.trigger !== 'none')
      .forEach(report => this.callback(report));
  };

  private observer = window.PerformanceObserver
    ? new PerformanceObserver(this.onObserveration)
    : {
        observe() {},
        disconnect() {},
        takeRecords() {
          return [];
        },
      };

  public observe() {
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

  public disconnect() {
    this.observer.disconnect();
  }

  public takeRecords() {
    return this.observer.takeRecords();
  }
}
