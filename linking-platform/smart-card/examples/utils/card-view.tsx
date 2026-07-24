/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

import { css, jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { Card } from '@atlaskit/smart-card';
import { token } from '@atlaskit/tokens';

import type { MultiCardViewProps } from './card-view-props';

export type CardViewLayoutProps = MultiCardViewProps & {
	/**
	 * When multiple `urls` are rendered, stack each card vertically (e.g. VR icon matrices).
	 * Default: siblings with no layout wrapper (matches historical CardView behaviour).
	 */
	stackUrlListVertically?: boolean;
};

const cardUrlListStackStyles = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	rowGap: token('space.100'),
	width: '100%',
});

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
	product,
	rovoOptions,
	truncateInline,
	showHoverPreview,
	CompetitorPrompt,
	stackUrlListVertically = false,
}: CardViewLayoutProps): JSX.Element => {
	const cards = (urls || [url]).map((currentUrl = defaultUrl, index: number) => (
		<Card
			key={`${currentUrl}-${index}`}
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
	));

	return (
		<SmartCardProvider client={client} product={product} rovoOptions={rovoOptions}>
			<EmbedCardWrapper inheritDimensions={inheritDimensions}>
				{stackUrlListVertically ? <div css={cardUrlListStackStyles}>{cards}</div> : cards}
			</EmbedCardWrapper>
		</SmartCardProvider>
	);
};

export default CardView;
