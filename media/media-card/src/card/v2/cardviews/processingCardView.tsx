/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useEffect, useRef } from 'react';

import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import { createAndFireMediaCardEvent } from '../../../utils/analytics';
import { IconWrapper } from '../../ui/iconWrapper/iconWrapper';
import { CreatingPreview } from '../../ui/iconMessage';
import { useBreakpoint } from '../../useBreakpoint';
import { CardViewWrapper, type SharedCardViewProps } from './cardViewWrapper';

export type ProcessingCardViewProps = SharedCardViewProps &
	WithAnalyticsEventsProps & {
		disableAnimation?: boolean;
		readonly innerRef?: (instance: HTMLDivElement | null) => void;
	};

const ProcessingCardViewBase = (props: ProcessingCardViewProps) => {
	const { disableAnimation, dimensions, metadata, disableOverlay, innerRef } = props;
	const divRef = useRef<HTMLDivElement>(null);
	const breakpoint = useBreakpoint(dimensions?.width, divRef);

	useEffect(() => {
		innerRef && !!divRef.current && innerRef(divRef.current);
	}, [innerRef]);

	const { name, size, mediaType, mimeType } = metadata || {};
	const isZeroSize = size === 0;
	const hasTitleBox = !disableOverlay && !!name;

	return (
		<CardViewWrapper
			{...props}
			metadata={metadata}
			breakpoint={breakpoint}
			data-test-status="processing"
			ref={divRef}
		>
			<IconWrapper breakpoint={breakpoint} hasTitleBox={hasTitleBox}>
				<MimeTypeIcon
					testId="media-card-file-type-icon"
					mediaType={mediaType}
					mimeType={mimeType}
					name={name}
				/>
				{!isZeroSize && <CreatingPreview disableAnimation={disableAnimation} />}
			</IconWrapper>
		</CardViewWrapper>
	);
};

// TODO: check if analytics is correct

export const ProcessingCardView = withAnalyticsEvents({
	onClick: createAndFireMediaCardEvent({
		eventType: 'ui',
		action: 'clicked',
		actionSubject: 'mediaCard',
		attributes: {},
	}),
})(ProcessingCardViewBase);
