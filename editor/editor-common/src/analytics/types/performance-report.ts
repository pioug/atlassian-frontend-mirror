export interface PluginMethodReport {
	onEditorViewStateUpdated: number;
	stateApply: number;
	viewUpdate: number;
}

export interface PluginsReport {
	[name: string]: PluginMethodReport;
}

export type NodeCount = Record<string, number>;
export interface PluginPerformanceReportData {
	duration: number;
	extensionNodes: NodeCount;
	nodes: NodeCount;
	plugins: PluginsReport;
	slowPlugins: PluginsReport;
	stepDurations: {
		countNodes: number;
		onChange: number;
		onEditorViewStateUpdated: number;
		stateApply: number;
		viewUpdate: number;
	};
	trigger: string;
}
