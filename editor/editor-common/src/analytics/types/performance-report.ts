export interface PluginMethodReport {
  stateApply: number;
  viewUpdate: number;
  onEditorViewStateUpdated: number;
}

export interface PluginsReport {
  [name: string]: PluginMethodReport;
}

export type NodeCount = Record<string, number>;
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
