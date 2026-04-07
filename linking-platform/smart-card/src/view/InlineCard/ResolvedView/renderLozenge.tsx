import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { type LozengeProps } from '../../../types';
import InlineLozenge from '../common/inline-lozenge';

const LOZENGE_TEST_ID = 'inline-card-resolved-view-lozenge';

export function renderLozenge(lozenge: LozengeProps | undefined): React.JSX.Element | null {
	if (!lozenge || !lozenge?.text) {
		return null;
	}
	if (fg('platform-dst-lozenge-tag-badge-visual-uplifts')) {
		const stateMetricMatch = lozenge.text.match(/^(.+?)\s+-\s+(\d+(?:\.\d+)?)$/);
		if (stateMetricMatch) {
			const [, label, metric] = stateMetricMatch;
			const appearance = lozenge.appearance || 'neutral';
			return (
				<InlineLozenge
					testId={LOZENGE_TEST_ID}
					appearance={appearance}
					style={{
						backgroundColor: lozenge?.style?.backgroundColor,
						color: lozenge?.style?.color,
					}}
					trailingMetric={metric}
				>
					{label}
				</InlineLozenge>
			);
		}
	}
	const appearance = lozenge.appearance || 'default';
	return (
		<InlineLozenge
			testId={LOZENGE_TEST_ID}
			appearance={appearance}
			style={{ backgroundColor: lozenge?.style?.backgroundColor, color: lozenge?.style?.color }}
			isBold={lozenge.isBold !== false}
		>
			{lozenge.text}
		</InlineLozenge>
	);
}
