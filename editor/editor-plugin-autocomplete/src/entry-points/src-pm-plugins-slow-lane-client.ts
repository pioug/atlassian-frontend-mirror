/* eslint-disable @atlaskit/editor/no-re-export */
export {
	createSlowLaneClient,
	getStoredContextVector,
	getStoredLmLogits,
	isWordBoundary,
	setDefaultSlowLaneClient,
} from '../pm-plugins/slow-lane-client';
export type {
	SlowLaneClientConfig,
	TypeaheadEncodingsRequest,
	TypeaheadEncodingsResponse,
} from '../pm-plugins/slow-lane-client';
