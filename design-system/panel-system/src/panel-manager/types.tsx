import type { EntryPoint } from 'react-relay';

/**
 * Represents a single panel instance in the system
 */
export type Panel = {
	/**
	 * A unique ID for this panel instance.
	 * Generated at runtime when the panel is opened.
	 * Example: "panel_a7f3k2m9"
	 */
	instanceId: string;
	/**
	 * Entry point this instance is based on.
	 */
	entryPoint: EntryPoint<any, any>;
	/**
	 * The specific data/props passed to this instance when it was opened.
	 * Example: { issueKey: "JRA-123" }
	 */
	params: Record<string, any>;
};

/**
 * Global panel system state containing all active panels
 */
export type PanelSystemState = {
	/**
	 * Array of all currently active panels
	 */
	activePanels: Panel[];
};

/**
 * Actions that can modify the panel system state
 */
export type PanelAction =
	| {
			type: 'PANEL_OPEN';
			payload: {
				instanceId: string;
				entryPoint: EntryPoint<any, any>;
				params?: any;
			};
	  }
	| {
			type: 'PANEL_CLOSE';
			payload: {
				instanceId: string;
			};
	  };
