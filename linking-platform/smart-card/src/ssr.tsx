import React, { useState } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import uuid from 'uuid';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import type { CardProps } from './types';
import { context } from './utils/analytics/analytics';
import { CardWithUrlContent } from './view/CardWithUrl/component';
import { LoadingCardLink } from './view/CardWithUrl/component-lazy/LoadingCardLink';

export type CardSSRProps = CardProps & { hideIconLoadingSkeleton?: boolean; url: string };

// SSR friendly version of smart-card
// simplifies the logic around rendering and loading placeholders and
// only contains whats necessary to render the card on SSR mode
export const CardSSR = (props: CardSSRProps) => {
	const [id] = useState(() => props.id ?? uuid());
	const cardProps = {
		...props,
		id,
	};

	const ErrorFallbackComponent = cardProps.fallbackComponent;

	const errorBoundaryFallbackComponent = () => {
		if (ErrorFallbackComponent) {
			return <ErrorFallbackComponent />;
		}

		return <LoadingCardLink {...cardProps} />;
	};

	if (fg('platform_editor_inline_card_selected_state_fix')) {
		const Component = cardProps.appearance === 'inline' ? 'span' : 'div';

		return (
			<AnalyticsContext data={context}>
				<ErrorBoundary FallbackComponent={errorBoundaryFallbackComponent}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
					<Component className="loader-wrapper">
						<CardWithUrlContent {...cardProps} />
					</Component>
				</ErrorBoundary>
			</AnalyticsContext>
		);
	}

	return (
		<AnalyticsContext data={context}>
			<ErrorBoundary FallbackComponent={errorBoundaryFallbackComponent}>
				<CardWithUrlContent {...cardProps} />
			</ErrorBoundary>
		</AnalyticsContext>
	);
};
