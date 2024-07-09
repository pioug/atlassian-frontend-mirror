import React, { useCallback, useMemo } from 'react';

import { Inline } from '@atlaskit/primitives';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { SmartLinkSize } from '../../../../../../../../constants';
import extractFlexibleUiContext from '../../../../../../../../extractors/flexible';
import Icon from '../../../../../elements/icon';
import Link from '../../../../../elements/link';
import { type ResolvedResultItemProps } from './types';
import { fireLinkClickedEvent } from '../../../../../../../../utils/analytics/click';

const RelatedUrlItem = ({ results, renderers, testId }: ResolvedResultItemProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const flexibleDataContext = useMemo(
		() =>
			extractFlexibleUiContext({
				response: results,
				renderers,
			}),
		[renderers, results],
	);

	const onClick = useCallback(
		(event: React.MouseEvent) => {
			fireLinkClickedEvent(createAnalyticsEvent)(event);
		},
		[createAnalyticsEvent],
	);

	return (
		<Inline alignBlock="center" space="space.050" testId={testId}>
			<Icon
				{...flexibleDataContext?.linkIcon}
				testId={`${testId}-icon`}
				size={SmartLinkSize.Small}
			/>
			<Link
				testId={`${testId}-link`}
				text={flexibleDataContext?.title}
				url={flexibleDataContext?.url}
				size={SmartLinkSize.Small}
				maxLines={1}
				onClick={onClick}
			/>
		</Inline>
	);
};

export default RelatedUrlItem;
