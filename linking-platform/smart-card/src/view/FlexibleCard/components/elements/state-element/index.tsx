import React, { useMemo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseLozengeElement, type BaseLozengeElementProps } from '../common';

export type StateElementProps = BaseLozengeElementProps;

const STATE_METRIC_REGEX = /^(.+?)\s+-\s+(\d+(?:\.\d+)?)$/;

const StateElement = (props: StateElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context?.state ?? null;

	const metricProps = fg('platform-dst-lozenge-tag-badge-visual-uplifts')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useMemo(() => {
				if (data && typeof data.text === 'string') {
					const match = data.text.match(STATE_METRIC_REGEX);
					if (match) {
						return { text: match[1], trailingMetric: match[2] };
					}
				}
				return null;
			}, [data])
		: undefined;

	if (!data) {
		return null;
	}

	return <BaseLozengeElement {...data} {...props} {...metricProps} name={ElementName.State} />;
};

export default StateElement;
