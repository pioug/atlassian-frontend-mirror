import React, { useCallback, useEffect, useRef, useState } from 'react';

import { HoverCard } from '../../../../HoverCard';
import { ElementName } from '../../../../../constants';
import { type HoverCardDelayProps } from './types';

const FLEXIBLE_HOVER_CARD_CAN_OPEN_DELAY = 100;

const HoverCardControl = ({
	children,
	isHoverPreview,
	isAuthTooltip,
	actionOptions,
	testId,
	url,
	delay = FLEXIBLE_HOVER_CARD_CAN_OPEN_DELAY,
	hoverPreviewOptions,
}: HoverCardDelayProps) => {
	const [canOpen, setCanOpen] = useState(true);
	const mouseStopTimer = useRef<ReturnType<typeof setTimeout>>();

	useEffect(() => {
		return () => {
			if (mouseStopTimer.current) {
				clearTimeout(mouseStopTimer.current);
			}
		};
	}, []);

	const onMouseLeave = useCallback(() => {
		if (mouseStopTimer.current) {
			clearTimeout(mouseStopTimer.current);
		}
	}, []);

	const onMouseMove = useCallback(
		(e: any) => {
			if (mouseStopTimer.current) {
				clearTimeout(mouseStopTimer.current);
			}

			// Never show hover card on action or when action dropdown opens.
			// The code below can be simplified by using :is() and :has()
			// but the pseudo-class isn't support by Firefox yet.
			const action =
				// Any action button group (title/footer block)
				e.target.closest('.actions-button-group') ||
				// When action dropdown list is opened on action button group or lozenge action
				e.target.closest('[data-smart-link-container]')?.querySelector('[data-action-open="true"]');

			const canOpenOnElement =
				(isAuthTooltip && !action) ||
				// EDM-7060: For hover preview, also hide hover card on all elements
				// except title element (link title)
				(isHoverPreview &&
					!action &&
					!e.target.closest(
						`[data-smart-element]:not([data-smart-element="${ElementName.Title}"])`,
					));

			mouseStopTimer.current = setTimeout(() => {
				if (canOpen !== canOpenOnElement) {
					setCanOpen(Boolean(canOpenOnElement));
				}
			}, delay);
		},
		[isAuthTooltip, isHoverPreview, canOpen, delay],
	);

	return (
		<HoverCard
			allowEventPropagation={true}
			canOpen={canOpen}
			closeOnChildClick={true}
			actionOptions={actionOptions}
			url={url}
			hoverPreviewOptions={hoverPreviewOptions}
		>
			<span
				onMouseLeave={onMouseLeave}
				onMouseMove={onMouseMove}
				data-testid={`${testId}-hover-card-wrapper`}
			>
				{children}
			</span>
		</HoverCard>
	);
};

export default HoverCardControl;
