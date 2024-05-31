/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/** @jsx jsx */
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import { useIntl } from 'react-intl-next';

import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import { ZERO_WIDTH_JOINER } from '@atlaskit/editor-common/utils';
import PreferencesIcon from '@atlaskit/icon/glyph/preferences';
import { N0, N30A, N40A, N60A, N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import {
	getChildElement,
	getInlineCardAvailableWidth,
	isOneLine,
} from '../InlineCardOverlay/utils';

const DEBOUNCE_IN_MS = 5;
const PADDING_IN_PX = 4;
const ICON_WIDTH_IN_PX = 16;
const ICON_AND_LABEL_CLASSNAME = 'ak-editor-card-overlay-icon-and-label';
const OVERLAY_MARKER_CLASSNAME = 'ak-editor-card-overlay-marker';
const TEXT_NODE_SELECTOR = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].join(',');

const SMART_LINK_BACKGROUND_COLOR = token('elevation.surface.raised', N0);
const CONFIGURE_ICON_BACKGROUND_COLOR = token('color.background.neutral', N30A);
const CONFIGURE_ICON_BACKGROUND_HOVERED_COLOR = token('color.background.neutral.hovered', N40A);
const CONFIGURE_ICON_BACKGROUND_ACTIVE_COLOR = token('color.background.neutral.pressed', N60A);

const containerStyles = css({
	position: 'relative',
	lineHeight: 'normal',
});

const overlayStyles = css({
	position: 'absolute',
	// Vertically align. Required for overlay to be centered inside the inline link (the inline lozenge is slightly larger than the designs)
	transform: 'translate(0%, -50%)',
	top: '50%',

	// Set default styling to be invisible but available in dom for width calculation.
	visibility: 'hidden',

	overflow: 'hidden',

	// EDM-1717: box-shadow Safari fix bring load wrapper zIndex to 1
	zIndex: 2,
});

const showOverlayStyles = css({
	visibility: 'visible',
});

const iconStyles = css({
	background: CONFIGURE_ICON_BACKGROUND_COLOR,
	':hover': {
		background: CONFIGURE_ICON_BACKGROUND_HOVERED_COLOR,
	},
	':active': {
		background: CONFIGURE_ICON_BACKGROUND_ACTIVE_COLOR,
	},
	span: {
		// If PreferencesIcon left as inline-block (default), height is incorrect and border radius is clipped when parent element
		// uses 1lh height (rather than 100%)
		display: 'block',
	},
	// Note: The spec recomends 3px, but the icon doesn't fit left of the lozenge text if this size
	padding: token('space.025', '2px'),
	borderRadius: '3px',
});

const iconAndLabelStyles = css({
	display: 'flex',
	alignItems: 'center',
	height: '100%',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '2.5px', // Margin from very left of entire card (inclusive of blue)

	// This exists so if we set a semi-transparent background above, the provider icon doesn't show
	background: SMART_LINK_BACKGROUND_COLOR,
	// Ensure we don't have a white gap when the inline-card is in an active state
	borderRadius: '3px',

	color: token('color.text.subtlest', N700),
});

export type LeftIconOverlayProps = React.HTMLAttributes<HTMLSpanElement> & {
	isSelected?: boolean;
	isVisible?: boolean;
	testId?: string;
};

const LeftIconOverlay = ({
	children,
	isSelected = false,
	isVisible = false,
	testId = 'inline-card-overlay',
	...props
}: React.PropsWithChildren<LeftIconOverlayProps>) => {
	const [showOverlay, setShowOverlay] = useState(false);
	const [availableWidth, setAvailableWidth] = useState<number | undefined>(undefined);

	const containerRef = useRef<HTMLSpanElement>(null);

	// TODO EDM-9853: Use availableWidth for small link edge case
	// Calculation logic will need to updated.
	availableWidth;

	const setVisibility = useCallback(() => {
		if (!containerRef.current) {
			return;
		}

		const marker = getChildElement(containerRef, `.${OVERLAY_MARKER_CLASSNAME}`);
		if (!marker) {
			return;
		}

		try {
			const oneLine = isOneLine(containerRef.current, marker);

			// Get the width of the available space to display overlay.
			// This is the width of the inline link itself. If the inline
			// is wrapped to the next line, this is width of the last line.
			const availableWidth =
				getInlineCardAvailableWidth(containerRef.current, marker) -
				PADDING_IN_PX -
				// Always leave at least the icon visible
				(oneLine ? ICON_WIDTH_IN_PX + PADDING_IN_PX : 0);
			setAvailableWidth(availableWidth);

			const canShowOverlay = !isSelected;
			setShowOverlay(canShowOverlay);
		} catch {
			// If something goes wrong, hide the overlay all together.
			setShowOverlay(false);
		}
	}, [isSelected]);

	useLayoutEffect(() => {
		if (!containerRef.current) {
			return;
		}

		if (isVisible) {
			setVisibility();
		}
	}, [setVisibility, isVisible]);

	useEffect(() => {
		// Find the closest block parent to observe size change
		const parent = containerRef?.current?.closest(TEXT_NODE_SELECTOR);
		if (!parent) {
			return;
		}

		const updateOverlay = debounce((entries) => {
			if (!isVisible) {
				return;
			}

			const size = entries?.[0]?.contentBoxSize?.[0]?.inlineSize;
			if (!size) {
				return;
			}

			setVisibility();
		}, DEBOUNCE_IN_MS);

		const observer = new ResizeObserver(updateOverlay);
		observer.observe(parent);
		return () => {
			observer.disconnect();
		};
	}, [isVisible, setVisibility]);

	const intl = useIntl();
	const configureLinkLabel: string = intl.formatMessage(messages.inlineConfigureLink);

	return (
		<span {...props} css={containerStyles} ref={containerRef}>
			{isVisible && (
				<Tooltip content={configureLinkLabel}>
					{(tooltipProps) => (
						<React.Fragment>
							{/* ClassName usage for calculating availableWidth */}
							<span aria-hidden="true" className={OVERLAY_MARKER_CLASSNAME}>
								{ZERO_WIDTH_JOINER}
							</span>
							<span
								css={[overlayStyles, showOverlay && showOverlayStyles]}
								tabIndex={-1}
								data-testid={testId}
							>
								<span
									{...tooltipProps}
									css={iconAndLabelStyles}
									className={ICON_AND_LABEL_CLASSNAME}
								>
									<span css={iconStyles}>
										<PreferencesIcon
											label={configureLinkLabel}
											size={'small'}
											testId={`${testId}-icon`}
										/>
									</span>
								</span>
							</span>
						</React.Fragment>
					)}
				</Tooltip>
			)}
			{children}
		</span>
	);
};

export default LeftIconOverlay;
