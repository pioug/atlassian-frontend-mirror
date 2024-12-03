export type AlignmentState = 'start' | 'end' | 'center';

export type AlignmentPluginState = {
	align: AlignmentState;
	isEnabled?: boolean;
};

export enum ToolbarType {
	PRIMARY = 'primaryToolbar',
	FLOATING = 'floatingToolbar',
}
