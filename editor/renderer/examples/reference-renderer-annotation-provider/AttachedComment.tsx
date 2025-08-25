/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { usePosition } from './internal-ui/Position';

export function AttachedComment({
	range,
	activeComment,
	portalContainer,
	stickyHeaderHeight,
	children,
}: {
	activeComment: string;
	children: React.ReactNode;
	portalContainer: Element;
	range: Range;
	stickyHeaderHeight: number;
}) {
	const position = usePosition({ range, portalContainer });
	// ^ get range from activeComment
	// ---> either
	//       - link to the dom element for a selected comment
	//       - or to a draft range for a new comment that has not yet had a html element created
	//       - or to a the dom element for a draft range which has had a html element created

	return ReactDOM.createPortal(
		<div css={sidebarContainer} style={{ top: stickyHeaderHeight + position.top }}>
			{children}
		</div>,
		portalContainer,
	);
}

const sidebarContainer = css({
	zIndex: 11,
	border: `1px solid ${token('color.border', '#dfe1e6')}`,
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
	boxShadow: `${token('elevation.shadow.overflow', '0 8px 16px -4px rgba(9, 30, 66, 0.25)')}`,
	backgroundColor: `${token('elevation.surface', '#fff')}`,
	right: '12px',
	position: 'absolute',
	display: 'flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginBottom: '100px',
	width: '280px',
});
