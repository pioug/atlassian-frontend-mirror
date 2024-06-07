/** @jsx jsx */
import LinkGlyph from '@atlaskit/icon/glyph/link';
import { jsx } from '@emotion/react';
import React, { type FC, useMemo } from 'react';
import { ExpandedFrame } from '../../components/ExpandedFrame';
import { ImageIcon } from '../../components/ImageIcon';

import {
	containerStyles,
	contentStyles,
	descriptionStyles,
	imageStyles,
	titleStyles,
} from './styled';
import type { UnresolvedViewProps } from './types';

const UnresolvedView: FC<UnresolvedViewProps> = ({
	button,
	description,
	frameStyle,
	icon: iconUrlOrElement,
	image,
	inheritDimensions,
	isSelected,
	onClick,
	testId,
	text,
	title,
	url,
}) => {
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

	return (
		<ExpandedFrame
			allowScrollBar={true}
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
					<img css={imageStyles} data-testid={`${testId}-unresolved-image`} src={image} />
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
