import React, { type CSSProperties, useEffect, useState } from 'react';

import debounce from 'lodash/debounce';
import { useIntl } from 'react-intl-next';

import InfoIcon from '@atlaskit/icon/glyph/info';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { externalMediaMessages } from '../media';

import { getBadgeSize } from './CommentBadge';

const baseStyles = xcss({
	position: 'absolute',
	top: 'space.025',
	borderRadius: 'border.radius',
	backgroundColor: 'elevation.surface',
	zIndex: 'tooltip',
	lineHeight: token('space.200'),
	right: 'var(--right-offset)',
	cursor: 'pointer',
});

type ExternalImageBadgeProps = {
	mediaElement?: HTMLElement | null;
	commentBadgeRightOffset?: number;
	mediaHeight?: number;
	mediaWidth?: number;
};

export const ExternalImageBadge = ({
	mediaWidth,
	mediaHeight,
	commentBadgeRightOffset = 0,
	mediaElement,
}: ExternalImageBadgeProps) => {
	const intl = useIntl();
	const message = intl.formatMessage(externalMediaMessages.externalMediaFile);
	const [badgeSize, setBadgeSize] = useState<'medium' | 'small'>(
		getBadgeSize(mediaWidth, mediaHeight),
	);
	// detect resize of media element to adjust badge size
	// will combine with the comment badge resize observer when refactoring in the future to avoid multiple resize observers
	useEffect(() => {
		const observer = new ResizeObserver(
			debounce((entries) => {
				const [entry] = entries;
				const { width, height } = entry.contentRect;
				setBadgeSize(getBadgeSize(width, height));
			}),
		);

		if (mediaElement) {
			observer.observe(mediaElement as HTMLElement);
		}
		return () => {
			observer.disconnect();
		};
	}, [mediaElement]);

	const baseRightOffset = badgeSize === 'medium' ? 4 : 2;
	const rightOffset = baseRightOffset + commentBadgeRightOffset;

	return (
		<Box
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ '--right-offset': `${rightOffset}px` } as CSSProperties}
			padding={badgeSize === 'medium' ? 'space.050' : 'space.0'}
			data-external-image-badge="true"
			xcss={baseStyles}
			tabIndex={0}
		>
			<Tooltip content={message}>
				<InfoIcon size="small" label={message} />
			</Tooltip>
		</Box>
	);
};
