import { type UfoDurationMetrics } from './durationMetrics';
import { addCustomSpans } from '@atlaskit/react-ufo/interaction-metrics';

const mediaLabelStack = [{ name: 'media' }];

export const sendUfoDurationMetrics = (
	ufoDurationMetrics: UfoDurationMetrics,
	endpoint: 'image' | 'items',
) => {
	const labelStack = [...mediaLabelStack, { name: endpoint }];
	Object.entries(ufoDurationMetrics).map(([name, { start, end, size }]) => {
		addCustomSpans(name, start, end, size, labelStack);
	});
};
