import { outlier } from './outlier';
import {
  EVENT_NAME_STATE_APPLY,
  EVENT_NAME_UPDATE_STATE,
  EVENT_NAME_ON_CHANGE,
  EVENT_NAME_VIEW_STATE_UPDATED,
} from './track-transactions';

export interface PluginMethodReport {
  stateApply: number;
  viewUpdate: number;
  onEditorViewStateUpdated: number;
}

export interface OutlierReport {
  stateApplyOutlier: number | undefined;
  viewUpdateOutlier: number | undefined;
}

export interface PluginsReport {
  [name: string]: PluginMethodReport;
}

export interface PluginPerformanceReportData {
  trigger: string;
  duration: number;
  nodes: NodeCount;
  extensionNodes: NodeCount;
  plugins: PluginsReport;
  slowPlugins: PluginsReport;
  stepDurations: {
    stateApply: number;
    viewUpdate: number;
    onChange: number;
    onEditorViewStateUpdated: number;
    countNodes: number;
  };
}

export interface PluginPerformanceReportOptions {
  usePerformanceMarks?: boolean;
  samplingRate: number;
  slowThreshold: number;
  outlierThreshold: number;
  outlierFactor: number;
}

type NodeCount = Record<string, number>;

export type NodesCount = {
  nodeCount: NodeCount;
  extensionNodeCount: NodeCount;
};

export class PluginPerformanceReport {
  private count = 0;
  private pluginNames: string[] = [];
  private entryList?: PerformanceObserverEntryList;

  private stateApplied?: PerformanceEntry;
  private viewUpdated?: PerformanceEntry;
  private onChangeCalled?: PerformanceEntry;
  private onEditorViewStateUpdatedCalled?: PerformanceEntry;

  private nodes: NodeCount = {};
  private extensionNodes: NodeCount = {};
  private nodesDuration: number = 0;

  private plugins: PluginsReport = {};
  private slowPlugins: PluginsReport = {};

  private options: PluginPerformanceReportOptions = {
    samplingRate: 100,
    slowThreshold: 300,
    outlierThreshold: 30,
    outlierFactor: 3,
  };

  private constructor(private entry: PerformanceEntry) {}

  public static fromEntry(entry: PerformanceEntry): PluginPerformanceReport {
    return new PluginPerformanceReport(entry);
  }

  private isChild = (child: PerformanceEntry) =>
    child.startTime >= this.entry.startTime &&
    child.startTime + child.duration <=
      this.entry.startTime + this.entry.duration;

  private getEntryByName(
    entryList: PerformanceObserverEntryList,
    name: string,
  ) {
    return entryList.getEntriesByName(name).find(this.isChild);
  }

  private getMethodSum(methods: PluginMethodReport): number {
    return Object.values(methods).reduce((a, b) => a + b, 0);
  }

  private greaterEquals(a: number, b?: number): boolean {
    return typeof b === 'number' ? a >= b : false;
  }

  private hasOutlierMethods(
    methods: PluginMethodReport,
    outliers: OutlierReport,
  ): boolean {
    return (
      this.greaterEquals(methods.stateApply, outliers.stateApplyOutlier) ||
      this.greaterEquals(methods.viewUpdate, outliers.viewUpdateOutlier)
    );
  }

  public get trigger(): 'none' | 'slow' | 'distribution' | 'sample' {
    if (this.entry.duration > this.options.slowThreshold) {
      return 'slow';
    } else if (
      this.hasSlowPlugins &&
      this.entry.duration > this.options.outlierThreshold
    ) {
      return 'distribution';
    } else if (this.count > 0 && this.count % this.options.samplingRate === 0) {
      return 'sample';
    } else {
      return 'none';
    }
  }

  public get hasSlowPlugins(): boolean {
    return Object.keys(this.slowPlugins).length > 0;
  }

  public withEntryList(entryList: PerformanceObserverEntryList): this {
    this.entryList = entryList;
    this.stateApplied = this.getEntryByName(entryList, EVENT_NAME_STATE_APPLY);
    this.viewUpdated = this.getEntryByName(entryList, EVENT_NAME_UPDATE_STATE);
    this.onChangeCalled = this.getEntryByName(entryList, EVENT_NAME_ON_CHANGE);
    this.onEditorViewStateUpdatedCalled = this.getEntryByName(
      entryList,
      EVENT_NAME_VIEW_STATE_UPDATED,
    );
    this.withPlugins(this.pluginNames);
    return this;
  }

  public withPlugins(pluginNames: string[]): this {
    const emptyEntry = { duration: 0 };
    this.pluginNames = pluginNames;

    this.plugins = pluginNames.reduce<PluginsReport>((acc, name) => {
      const pluginApplied = this.entryList
        ? this.getEntryByName(this.entryList, `🦉${name}::apply`) || emptyEntry
        : emptyEntry;

      const pluginViewUpdated = this.entryList
        ? this.getEntryByName(this.entryList, `🦉${name}::view::update`) ||
          emptyEntry
        : emptyEntry;

      const pluginOnEditorViewStateUpdated = this.entryList
        ? this.getEntryByName(
            this.entryList,
            `🦉${name}::onEditorViewStateUpdated`,
          ) || emptyEntry
        : emptyEntry;

      acc[name] = {
        stateApply: pluginApplied.duration,
        viewUpdate: pluginViewUpdated.duration,
        onEditorViewStateUpdated: pluginOnEditorViewStateUpdated.duration,
      };

      return acc;
    }, {});

    if (this.stateApplied && pluginNames.length > 0) {
      const pluginEntries = Object.entries(this.plugins);
      const stateApplyOutlier = outlier(
        pluginEntries.map(([, { stateApply }]) => stateApply),
        this.options.outlierFactor,
      );
      const viewUpdateOutlier = outlier(
        pluginEntries.map(([, { viewUpdate }]) => viewUpdate),
        this.options.outlierFactor,
      );

      const budget = this.options.outlierThreshold / pluginEntries.length;

      /**
       * Consider plugin methods slow that are
       * statistically significantly slower than peers
       * AND where the sum of methods for a plugin is slower than 16.7ms / plugins.length
       */
      const pluginIsOutlier = ([, methods]: [string, PluginMethodReport]) =>
        this.getMethodSum(methods) > budget &&
        this.hasOutlierMethods(methods, {
          stateApplyOutlier,
          viewUpdateOutlier,
        });

      this.slowPlugins = pluginEntries
        .filter(pluginIsOutlier)
        .reduce<PluginsReport>((acc, [n, d]) => ({ ...acc, [n]: d }), {});
    }

    return this;
  }

  public withNodes(nodesCount: NodesCount, nodesDuration: number = 0): this {
    this.nodes = nodesCount.nodeCount;
    this.extensionNodes = nodesCount.extensionNodeCount;
    this.nodesDuration = nodesDuration;
    return this;
  }

  public withCount(count: number): this {
    this.count = count;
    return this;
  }

  public withOptions(options: Partial<PluginPerformanceReportOptions>): this {
    Object.assign(this.options, options);
    return this;
  }

  public toJSON(): PluginPerformanceReportData {
    return {
      trigger: this.trigger,
      duration: this.entry.duration,
      nodes: this.nodes,
      extensionNodes: this.extensionNodes,
      plugins: this.plugins,
      slowPlugins: this.slowPlugins,
      stepDurations: {
        stateApply: this.stateApplied ? this.stateApplied.duration : 0,
        viewUpdate: this.viewUpdated ? this.viewUpdated.duration : 0,
        onChange: this.onChangeCalled ? this.onChangeCalled.duration : 0,
        onEditorViewStateUpdated: this.onEditorViewStateUpdatedCalled
          ? this.onEditorViewStateUpdatedCalled.duration
          : 0,
        countNodes: this.nodesDuration,
      },
    };
  }
}
