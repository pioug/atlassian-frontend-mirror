/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

import { css, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import LinkGlyph from '@atlaskit/icon/core/migration/link';
import { token } from '@atlaskit/tokens';

import { ExpandedFrame } from '../../components/ExpandedFrame';
import { ImageIcon } from '../../components/ImageIcon';

import type { UnresolvedViewProps } from './types';

const containerStyles = css({
	display: 'grid',
	height: 'inherit',
});

const contentStyles = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	textAlign: 'center',
	alignItems: 'center',
	margin: 'auto',
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
	gap: token('space.250', '20px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: '400px',
});

const descriptionStyles = css({
	font: token('font.body'),
	textAlign: 'center',
});

const imageStyles = css({
	height: '120px',
	width: '180px',
	objectFit: 'contain',
	objectPosition: 'center center',
});

const UnresolvedView = ({
	button,
	description,
	frameStyle,
	icon: iconUrlOrElement,
	image: imageUrlOrElement,
	inheritDimensions,
	isSelected,
	onClick,
	testId,
	text,
	title,
	url,
}: UnresolvedViewProps) => {
	const icon = useMemo(() => {
		if (React.isValidElement(iconUrlOrElement)) {
			return iconUrlOrElement;
		}
		return (
			<ImageIcon
				src={typeof iconUrlOrElement === 'string' ? iconUrlOrElement : undefined}
				default={
					<LinkGlyph
						label="icon"
						LEGACY_size="small"
						testId="embed-card-fallback-icon"
						color="currentColor"
					/>
				}
			/>
		);
	}, [iconUrlOrElement]);

	const image = useMemo(() => {
		if (!imageUrlOrElement) {
			return null;
		}

		const imageTestId = `${testId}-unresolved-image`;
		if (typeof imageUrlOrElement === 'string') {
			return <img css={imageStyles} data-testid={imageTestId} src={imageUrlOrElement} alt="" />;
		}

		return (
			<div css={imageStyles} data-testid={imageTestId}>
				{imageUrlOrElement}
			</div>
		);
	}, [imageUrlOrElement, testId]);

	return (
		<ExpandedFrame
			// Scroll bar must be shown for unresolved views to display the connect account button
			allowScrollBar={true}
			setOverflow={true}
			// EDM-9259: Fix embed frame showing on unresolved views when frameStyle is set to hide.
			// Set fallback to 'show' here to maintain the current behaviour when platform.editor.show-embed-card-frame-renderer is OFF.
			// Remove 'show' on platform.editor.show-embed-card-frame-renderer cleanup as frameStyle will be set to 'show' both in renderer and editor.
			// We want all views to be consistent and respect frameStyle instead of
			// having resolved view default to showOnHover and unresolved view default to show.
			// Default frameStyle is set inside <ExpandedFrame />
			frameStyle={frameStyle ?? 'show'}
			href={url}
			icon={icon}
			inheritDimensions={inheritDimensions}
			isSelected={isSelected}
			onClick={onClick}
			testId={testId}
			text={text}
		>
			<div css={containerStyles} data-testid={`${testId}-unresolved-container`}>
				<div css={contentStyles}>
					{image}
					<Heading size="large" testId={`${testId}-unresolved-title`}>
						{title}
					</Heading>
					<span css={descriptionStyles} data-testid={`${testId}-unresolved-description`}>
						{description}
					</span>
					{button}
				</div>
			</div>
		</ExpandedFrame>
	);
};

export default UnresolvedView;
