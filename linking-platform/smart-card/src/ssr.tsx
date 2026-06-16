import React, { useState } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { CardProps } from './types';
import { context } from './utils/analytics/analytics';
import { isFlexibleUiCard } from './utils/flexible';
import CardErrorBoundary from './view/CardWithUrl/card-error-boundary';
import { CardWithUrl, CardWithUrlContent } from './view/CardWithUrl/component';
import { LoadingCardLink } from './view/CardWithUrl/component-lazy/LoadingCardLink';

export type CardSSRProps = CardProps & {
	hideIconLoadingSkeleton?: boolean;
	placeholderData?: SmartLinkResponse;
	url: string;
	/**
	 * Server-rendered title fallback passed through to FlexibleCard layered links.
	 * On SSR we cannot reliably derive TitleBlock text from children, so this keeps
	 * server/client link text aligned and avoids hydration mismatches.
	 */
	title?: string;
};

// SSR friendly version of smart-card
// simplifies the logic around rendering and loading placeholders and
// only contains whats necessary to render the card on SSR mode
const CardSSROld = (props: CardSSRProps): React.JSX.Element => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const [id] = useState(() => props.id ?? uuid());
	// FlexibleCards always need full ORS data regardless of appearance prop,
	// because they render custom blocks (TitleBlock etc.) requiring a complete response.
	// Override appearance to 'block' for FlexibleCards when FG is enabled.
	const effectiveAppearance =
		isFlexibleUiCard(props.children, props.ui) &&
		fg('platform_smartlink_inline_resolve_optimization')
			? 'block'
			: props.appearance;

	const cardProps = {
		...props,
		id,
		appearance: effectiveAppearance,
	};

	const ErrorFallbackComponent = cardProps.fallbackComponent;

	const errorBoundaryFallbackComponent = () => {
		if (ErrorFallbackComponent) {
			return <ErrorFallbackComponent />;
		}

		return <LoadingCardLink {...cardProps} />;
	};

	const Component = effectiveAppearance === 'inline' ? 'span' : 'div';

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
};

// SSR friendly version of smart-card
// simplifies the logic around rendering and loading placeholders and
// only contains whats necessary to render the card on SSR mode
const CardSSRNew = (props: CardSSRProps): React.JSX.Element => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const [id] = useState(() => props.id ?? uuid());
	// FlexibleCards always need full ORS data regardless of appearance prop,
	// because they render custom blocks (TitleBlock etc.) requiring a complete response.
	// Override appearance to 'block' for FlexibleCards when FG is enabled.
	const effectiveAppearance =
		isFlexibleUiCard(props.children, props.ui) &&
		fg('platform_smartlink_inline_resolve_optimization')
			? 'block'
			: props.appearance;
	const propsWithId = { ...props, id, appearance: effectiveAppearance };

	return (
		<AnalyticsContext data={context}>
			<CardErrorBoundary {...propsWithId}>
				<CardWithUrl {...propsWithId} />
			</CardErrorBoundary>
		</AnalyticsContext>
	);
};

export const CardSSR = (props: CardSSRProps): React.JSX.Element => {
	if (fg('platform_sl_event_ui_seen')) {
		return <CardSSRNew {...props} />;
	}
	return <CardSSROld {...props} />;
};
