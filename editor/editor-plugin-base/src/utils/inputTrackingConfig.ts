import { type InputTracking } from '@atlaskit/editor-common/types';

export const inputTracking: InputTracking = {
	enabled: true,
	samplingRate: 100,
	countNodes: true,
	trackSeverity: true,
	trackRenderingTime: false,
	trackSingleKeypress: false,
	// TODO: change this based on appearance due to SLOs - need to make ticket for both
	severityDegradedThreshold: 273,
	severityNormalThreshold: 143,
};
