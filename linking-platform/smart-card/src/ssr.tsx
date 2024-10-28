import React, { useState } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import uuid from 'uuid';

import { AnalyticsContext } from '@atlaskit/analytics-next';

import type { CardProps } from './types';
import { context } from './utils/analytics/analytics';
import { CardWithUrlContent } from './view/CardWithUrl/component';
import { LoadingCardLink } from './view/CardWithUrl/component-lazy/LoadingCardLink';

export type CardSSRProps = CardProps & { url: string };

// SSR friendly version of smart-card
// simplifies the logic around rendering and loading placeholders and
// only contains whats necessary to render the card on SSR mode
export const CardSSR = (props: CardSSRProps) => {
	const [id] = useState(() => props.id ?? uuid());
	const cardProps = {
		...props,
		id,
	};

	return (
		<AnalyticsContext data={context}>
			<ErrorBoundary FallbackComponent={() => <LoadingCardLink {...cardProps} />}>
				<CardWithUrlContent {...cardProps} />
			</ErrorBoundary>
		</AnalyticsContext>
	);
};
