/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

import { css, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading/heading';
import LinkGlyph from '@atlaskit/icon/core/link';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Text } from '@atlaskit/primitives/compiled';
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
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
	gap: token('space.250'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: '400px',
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
	providerIcon,
	providerIconLabel,
	testId,
	text,
	title,
	url,
}: UnresolvedViewProps): JSX.Element => {
	// Unresolved embeds have no entity title. The frame shows the provider name, so
	// pair it with the provider/generator icon rather than the entity-type icon.
	const shouldUseProviderIcon =
		providerIcon != null && fg('platform_lp_use_generator_icon_for_provider');
	const frameIconUrlOrElement = shouldUseProviderIcon ? providerIcon : iconUrlOrElement;
	const frameIconLabel = shouldUseProviderIcon ? providerIconLabel : undefined;

	const icon = useMemo(() => {
		if (React.isValidElement(frameIconUrlOrElement)) {
			return frameIconUrlOrElement;
		}
		return (
			<ImageIcon
				src={typeof frameIconUrlOrElement === 'string' ? frameIconUrlOrElement : undefined}
				alt={frameIconLabel}
				default={<LinkGlyph label="icon" testId="embed-card-fallback-icon" color="currentColor" />}
			/>
		);
	}, [frameIconLabel, frameIconUrlOrElement]);

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
					<Text align="center" testId={`${testId}-unresolved-description`}>
						{description}
					</Text>
					{button}
				</div>
			</div>
		</ExpandedFrame>
	);
};

export default UnresolvedView;
