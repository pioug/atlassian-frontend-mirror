/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { LinkButton } from '@atlaskit/button/new';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import { token } from '@atlaskit/tokens';

import type { OpenButtonOverlayProps } from './types';

const containerStyles = css({
	position: 'relative',
});

const overlayStyles = css({
	position: 'absolute',
	left: '2px',
	top: 0,
	backgroundColor: token('color.background.accent.gray.subtlest', '#F1F2F4'),
	borderRadius: token('border.radius', '3px'),
	display: 'inline-flex',
	justifyContent: 'flex-start',
	alignItems: 'center',
	verticalAlign: 'text-top',
	height: '19px',
	overflow: 'hidden',
	// EDM-1717: box-shadow Safari fix bring load wrapper zIndex to 1
	zIndex: 2,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	a: {
		padding: `${token('border.width', '1px')} ${token('space.050', '4px')} 0 ${token('space.025', '2px')}`,
	},
});

const MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY = 45;

const OpenButtonOverlay = ({
	children,
	isVisible = false,
	url,
	...props
}: React.PropsWithChildren<OpenButtonOverlayProps>) => {
	// TODO: ED-26961 - add translation
	const label = 'Open';

	const containerRef = useRef<HTMLSpanElement>(null);
	const openButtonRef = useRef<HTMLDivElement>(null);
	const [showLabel, setShowLabel] = useState(true);

	const handleDoubleClick = () => {
		// Double click opens the link in a new tab
		window.open(url, '_blank');
	};

	useLayoutEffect(() => {
		if (!isVisible) {
			return;
		}
		const cardWidth = containerRef.current?.offsetWidth;
		const openButtonWidth = openButtonRef.current?.offsetWidth;

		const canShowLabel =
			cardWidth && openButtonWidth
				? cardWidth - openButtonWidth > MIN_AVAILABLE_SPACE_WITH_LABEL_OVERLAY
				: true;
		setShowLabel(canShowLabel);
	}, [isVisible]);

	return (
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading, jsx-a11y/no-static-element-interactions
		<span ref={containerRef} {...props} css={containerStyles} onDoubleClick={handleDoubleClick}>
			{children}
			{isVisible && (
				<div ref={openButtonRef} css={[overlayStyles]}>
					<LinkButton
						spacing="compact"
						href={url}
						target="_blank"
						iconBefore={LinkExternalIcon}
						appearance="default"
					>
						{showLabel ? label : ''}
					</LinkButton>
				</div>
			)}
		</span>
	);
};

export default OpenButtonOverlay;
