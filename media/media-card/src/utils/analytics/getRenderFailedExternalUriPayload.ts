import { type FileAttributes, type PerformanceAttributes } from '@atlaskit/media-common/analytics';

import type { RenderFailedEventPayload } from './analytics';

export const getRenderFailedExternalUriPayload = (
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
): RenderFailedEventPayload => ({
	eventType: 'operational',
	action: 'failed',
	actionSubject: 'mediaCardRender',
	attributes: {
		fileAttributes,
		performanceAttributes,
		status: 'fail',
		failReason: 'external-uri',
	},
});
