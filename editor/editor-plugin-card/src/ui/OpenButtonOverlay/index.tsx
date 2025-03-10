/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

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
		padding: `${token('border.width', '1px')} ${token('space.050', '4px')} 0`,
	},
});

const OpenButtonOverlay = ({
	children,
	isVisible = false,
	url,
	...props
}: React.PropsWithChildren<OpenButtonOverlayProps>) => {
	// TODO: ED-26961 - add translation
	const label = 'Open';

	const handleDoubleClick = () => {
		// Double click opens the link in a new tab
		window.open(url, '_blank');
	};
	return (
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading, jsx-a11y/no-static-element-interactions
		<span {...props} css={containerStyles} onDoubleClick={handleDoubleClick}>
			{children}
			{isVisible && (
				<div css={[overlayStyles]}>
					<LinkButton
						spacing="compact"
						href={url}
						target="_blank"
						iconBefore={LinkExternalIcon}
						appearance="default"
					>
						{label}
					</LinkButton>
				</div>
			)}
		</span>
	);
};

export default OpenButtonOverlay;
