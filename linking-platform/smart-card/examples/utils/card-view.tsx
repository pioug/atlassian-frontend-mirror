/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

import { css, jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { Card } from '@atlaskit/smart-card';

import type { MultiCardViewProps } from './card-view-props';

const embedCardWrapperStyles = css({
	width: '100%',
	height: '100%',
	// .loader-wrapper override is required for inheritDimensions smart card prop (see docstring)
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.loader-wrapper': {
		height: '100%',
	},
});

/**
 * Wrapper that wraps the embed in a smaller container div when `inheritDimensions` enabled
 */
const EmbedCardWrapper = ({
	children,
	inheritDimensions,
}: {
	children: React.ReactNode;
	inheritDimensions: boolean | undefined;
}): JSX.Element =>
	inheritDimensions ? (
		<div css={embedCardWrapperStyles}>{children}</div>
	) : (
		<Fragment>{children}</Fragment>
	);

const defaultUrl = 'https://some.url';
const CardView = ({
	appearance,
	client,
	frameStyle,
	isSelected,
	url,
	urls,
	inheritDimensions,
	truncateInline,
	showHoverPreview,
	CompetitorPrompt,
}: MultiCardViewProps) => (
	<SmartCardProvider client={client}>
		<EmbedCardWrapper inheritDimensions={inheritDimensions}>
			{ (urls || [url]).map((currentUrl = defaultUrl) => (
				<Card
					appearance={appearance}
					url={currentUrl}
					/* Embed-specific props */
					frameStyle={frameStyle}
					isSelected={isSelected}
					inheritDimensions={inheritDimensions}
					truncateInline={truncateInline}
					showHoverPreview={showHoverPreview}
					CompetitorPrompt={CompetitorPrompt}
				/>
			))}
		</EmbedCardWrapper>
	</SmartCardProvider>
);

export default CardView;
