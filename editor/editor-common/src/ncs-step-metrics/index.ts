// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export enum NCS_STORAGE {
	// remove step metrics keys when cleaning up platform_editor_remove_collab_step_metrics
	NCS_STORAGE_CLIENT_KEY = 'ncs-session-step-metrics-storage',
	NCS_SESSION_STEP_METRICS = 'ncsSessionStepMetrics',
	NCS_ACTIVE_SESSIONS = 'ncsActiveSessions',
}
