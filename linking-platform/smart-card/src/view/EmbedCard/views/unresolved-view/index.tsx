/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import LinkGlyph from '@atlaskit/icon/glyph/link';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React, { useMemo } from 'react';
import { gs } from '../../../common/utils';
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
	alignItems: 'center',
	margin: 'auto',
	padding: token('space.200', '16px'),
	gap: token('space.250', '20px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: gs(50),
});

const descriptionStyles = css({
	fontSize: '1em',
	textAlign: 'center',
});

const imageStyles = css({
	height: '120px',
	width: '180px',
	objectFit: 'contain',
	objectPosition: 'center center',
});

const titleStyles = css({
	textAlign: 'center',
	margin: 0,
	padding: 0,
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
				default={<LinkGlyph label="icon" size="small" testId="embed-card-fallback-icon" />}
			/>
		);
	}, [iconUrlOrElement]);

	const image = useMemo(() => {
		if (!imageUrlOrElement) {
			return null;
		}

		const imageTestId = `${testId}-unresolved-image`;
		if (typeof imageUrlOrElement === 'string') {
			return <img css={imageStyles} data-testid={imageTestId} src={imageUrlOrElement} />;
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
					<h2 css={titleStyles} data-testid={`${testId}-unresolved-title`}>
						{title}
					</h2>
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
